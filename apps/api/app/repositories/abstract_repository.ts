import { createError } from '@poppinss/utils';
import {
	ComparisonOperatorExpression,
	InsertQueryBuilder,
	OperandValueExpression,
	ReferenceExpression,
	SelectExpression,
	Transaction,
	UpdateObject,
} from 'kysely';

import { date } from '#services/date_factory';
import { type AppDB, db } from '#services/db';
import { generateUid } from '#services/uid_generator';
import { DB } from '#types/db';

// Delete
export type DeleteColumn<T extends Table> = ReferenceExpression<DB, ExtractTableAlias<DB, T>>;

export type DeleteReturn<T extends Table> = SelectExpression<DB, ExtractTableAlias<DB, T>>;

export type DeleteValue<T extends Table, C extends DeleteColumn<T>> = OperandValueExpression<
	DB,
	ExtractTableAlias<DB, T>,
	C
>;

export type ExtractTableAlias<DB, TE> = TE extends `${string} as ${infer TA}`
	? TA extends keyof DB
		? TA
		: never
	: TE extends keyof DB
		? TE
		: never;
// Insert
export type InsertPayload<T extends Table> = Parameters<
	InsertQueryBuilder<DB, T, NonNullable<unknown>>['values']
>[0];
export type InsertReturn<T extends Table> = SelectExpression<DB, T>;

// Select
export type SelectColumn<T extends Table> = ReferenceExpression<DB, ExtractTableAlias<DB, T>>;
export type SelectReturn<T extends Table> = SelectExpression<DB, ExtractTableAlias<DB, T>>;

export type SelectValue<T extends Table, C extends SelectColumn<T>> = OperandValueExpression<
	DB,
	ExtractTableAlias<DB, T>,
	C
>;
// Commons to all actions
export type Table = keyof DB;
export type UpdateColumn<T extends Table> = ReferenceExpression<DB, ExtractTableAlias<DB, T>>;
export type UpdateObjectExpression<
	DB,
	TB extends keyof DB,
	UT extends keyof DB = TB,
> = UpdateObject<DB, TB, UT>;

// Update
export type UpdatePayload<T extends Table> = UpdateObjectExpression<DB, ExtractTableAlias<DB, T>>;
export type UpdateReturn<T extends Table> = SelectExpression<DB, ExtractTableAlias<DB, T>>;
export type UpdateValue<T extends Table, C extends UpdateColumn<T>> = OperandValueExpression<
	DB,
	ExtractTableAlias<DB, T>,
	C
>;

export const RowNotFoundException = createError('Row not found', 'E_ROW_NOT_FOUND', 404);

export default abstract class AbstractRepository<T extends Table> {
	get query() {
		return {
			delete: (transaction?: Transaction<DB>) => this.#deleteQuery(transaction),
			select: (transaction?: Transaction<DB>) => this.#selectQuery(transaction),
			update: (transaction?: Transaction<DB>) => this.#updateQuery(transaction),
		};
	}
	protected readonly db: AppDB;

	protected readonly table: T;

	protected constructor(table: T) {
		this.db = db;
		this.table = table;
	}

	async count<C extends SelectColumn<T>>(
		countColumn: C,
		where?: ReadonlyArray<[C, ComparisonOperatorExpression, SelectValue<T, C>]>,
		transaction?: Transaction<DB>,
	) {
		let query = (transaction ?? this.db).selectFrom(this.table);

		if (where) {
			for (const [column, operator, value] of where) {
				query = query.where(column, operator, value);
			}
		}

		const result = await query
			.select(({ fn }) => [fn.count<number>(countColumn).as('count')])
			.executeTakeFirst();

		if (!result) {
			return 0;
		}

		return Number(result.count);
	}

	delete<C extends DeleteColumn<T>>(
		where: ReadonlyArray<[C, DeleteValue<T, C>]>,
		transaction?: Transaction<DB>,
	) {
		let query = (transaction ?? this.db).deleteFrom(this.table);

		for (const [column, value] of where) {
			query = query.where(column, '=', value);
		}

		return {
			execute: () => query.execute(),
			executeTakeFirst: () => query.executeTakeFirst(),
			executeTakeFirstOrThrow: () => query.executeTakeFirstOrThrow(),
			returning: <S extends DeleteReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.returning(selection).executeTakeFirst(),
			returningAll: () => query.returningAll().executeTakeFirst(),
			returningAllOrThrow: () => query.returningAll().executeTakeFirstOrThrow(),
			returningOrThrow: <S extends DeleteReturn<T>>(...selection: ReadonlyArray<S>) => {
				return query.returning(selection).executeTakeFirstOrThrow();
			},
		};
	}

	find<C extends SelectColumn<T>>(
		column: C,
		value: SelectValue<T, C>,
		transaction?: Transaction<DB>,
	) {
		const query = this.#findByQuery([[column, '=', value]], transaction);

		return {
			select: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.select(selection).executeTakeFirst(),
			selectAll: () => query.selectAll().executeTakeFirst(),
		};
	}

	findAll(transaction?: Transaction<DB>) {
		const query = (transaction ?? this.db).selectFrom(this.table);

		return {
			select: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.select(selection).execute(),
			selectAll: () => query.selectAll().execute(),
		};
	}

	findBy<C extends SelectColumn<T>>(
		where: ReadonlyArray<[C, ComparisonOperatorExpression, SelectValue<T, C>]>,
		transaction?: Transaction<DB>,
	) {
		const query = this.#findByQuery(where, transaction);

		return {
			select: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.select(selection).execute(),
			selectAll: () => query.selectAll().execute(),
		};
	}

	findOneBy<C extends SelectColumn<T>>(
		where: ReadonlyArray<[C, ComparisonOperatorExpression, SelectValue<T, C>]>,
		transaction?: Transaction<DB>,
	) {
		const query = this.#findByQuery(where, transaction);

		return {
			select: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.select(selection).executeTakeFirst(),
			selectAll: () => query.selectAll().executeTakeFirst(),
		};
	}

	findOneByOrFail<C extends SelectColumn<T>>(
		where: ReadonlyArray<[C, ComparisonOperatorExpression, SelectValue<T, C>]>,
		transaction?: Transaction<DB>,
	) {
		const query = this.#findByQuery(where, transaction);

		return {
			select: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.select(selection).executeTakeFirstOrThrow(RowNotFoundException),
			selectAll: () => query.selectAll().executeTakeFirstOrThrow(RowNotFoundException),
		};
	}

	findOrFail<C extends SelectColumn<T>>(
		column: C,
		value: SelectValue<T, C>,
		transaction?: Transaction<DB>,
	) {
		const query = this.#findByQuery([[column, '=', value]], transaction);

		return {
			select: <S extends SelectReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.select(selection).executeTakeFirstOrThrow(RowNotFoundException),
			selectAll: () => query.selectAll().executeTakeFirstOrThrow(RowNotFoundException),
		};
	}

	protected $create({
		payload,
		transaction,
	}: {
		payload: InsertPayload<T>;
		transaction?: Transaction<DB>;
	}) {
		const query = (transaction ?? this.db).insertInto(this.table).values(payload);

		return {
			returning: <S extends InsertReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.returning(selection).executeTakeFirst(),
			returningAll: () => query.returningAll().executeTakeFirst(),
			returningAllOrThrow: () => query.returningAll().executeTakeFirstOrThrow(),
			returningOrThrow: <S extends InsertReturn<T>>(...selection: ReadonlyArray<S>) => {
				return query.returning(selection).executeTakeFirstOrThrow();
			},
		};
	}

	protected $update<C extends UpdateColumn<T>>({
		payload,
		transaction,
		where,
	}: {
		payload: UpdatePayload<T>;
		transaction?: Transaction<DB>;
		where: ReadonlyArray<[C, UpdateValue<T, C>]>;
	}) {
		let query = (transaction ?? this.db).updateTable(this.table).set(payload);

		for (const [column, value] of where) {
			query = query.where(column, '=', value);
		}

		return {
			execute: () => query.execute(),
			executeTakeFirst: () => query.executeTakeFirst(),
			executeTakeFirstOrThrow: () => query.executeTakeFirstOrThrow(),
			returning: <S extends UpdateReturn<T>>(...selection: ReadonlyArray<S>) =>
				query.returning(selection).executeTakeFirst(),
			returningAll: () => query.returningAll().executeTakeFirst(),
			returningAllOrThrow: () => query.returningAll().executeTakeFirstOrThrow(),
			returningOrThrow: <S extends UpdateReturn<T>>(...selection: ReadonlyArray<S>) => {
				return query.returning(selection).executeTakeFirstOrThrow();
			},
		};
	}

	protected now() {
		return date().toSQL();
	}

	protected uid() {
		return generateUid();
	}

	#deleteQuery(transaction?: Transaction<DB>) {
		return (transaction ?? this.db).deleteFrom(this.table);
	}

	#findByQuery<C extends SelectColumn<T>>(
		where: ReadonlyArray<[C, ComparisonOperatorExpression, SelectValue<T, C>]>,
		transaction?: Transaction<DB>,
	) {
		let query = (transaction ?? this.db).selectFrom(this.table);

		for (const [column, operator, value] of where) {
			query = query.where(column, operator, value);
		}

		return query;
	}

	#selectQuery(transaction?: Transaction<DB>) {
		return (transaction ?? this.db).selectFrom(this.table);
	}

	#updateQuery(transaction?: Transaction<DB>) {
		return (transaction ?? this.db).updateTable(this.table);
	}
}
