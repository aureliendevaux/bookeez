import { Transaction } from 'kysely';

import AbstractRepository, { SelectColumn, SelectValue } from '#repositories/abstract_repository';
import { date } from '#services/date_factory';
import { generateUid } from '#services/uid_generator';
import { type DB, Kind } from '#types/db';
import type { CommonFields } from '#types/index';

type CreateKindDTO = Omit<Kind.Create, CommonFields>;
type UpdateKindDTO = Omit<Kind.Update, CommonFields>;

export default class KindRepository extends AbstractRepository {
	get query() {
		return {
			select: (transaction?: Transaction<DB>) => this.$selectQuery({ table: 'kinds', transaction }),
			update: (transaction?: Transaction<DB>) => this.$updateQuery({ table: 'kinds', transaction }),
			delete: (transaction?: Transaction<DB>) => this.$deleteQuery({ table: 'kinds', transaction }),
		};
	}

	get(id: number, transaction?: Transaction<DB>) {
		return this.$findBy({
			table: 'kinds',
			where: [['id', id]],
			transaction,
		});
	}

	findBy<Col extends SelectColumn<'kinds'>>(
		where: ReadonlyArray<[Col, SelectValue<'kinds', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$findBy({
			table: 'kinds',
			where,
			transaction,
		});
	}

	create(payload: CreateKindDTO, transaction?: Transaction<DB>) {
		return this.$create({
			table: 'kinds',
			payload: {
				uid: generateUid(),
				...payload,
				createdAt: date().toSQL(),
				updatedAt: date().toSQL(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'kinds'>>(
		where: ReadonlyArray<[Col, SelectValue<'kinds', Col>]>,
		payload: UpdateKindDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			table: 'kinds',
			where,
			payload: { ...payload, updatedAt: date().toSQL() },
			transaction,
		});
	}

	delete<Col extends SelectColumn<'kinds'>>(
		where: ReadonlyArray<[Col, SelectValue<'kinds', Col>]>,
		transaction?: Transaction<DB>,
	) {
		return this.$delete({
			table: 'kinds',
			where,
			transaction,
		});
	}
}
