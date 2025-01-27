import { Transaction } from 'kysely';

import type { CommonFields } from '#types/index';

import AbstractRepository, {
	type SelectColumn,
	type SelectValue,
} from '#repositories/abstract_repository';
import { type DB, BookType } from '#types/db';

type CreateBookTypeDTO = Omit<BookType.Create, CommonFields>;
type UpdateBookTypeDTO = Omit<BookType.Update, CommonFields>;

export default class BookTypeRepository extends AbstractRepository<'book_types'> {
	constructor() {
		super('book_types');
	}

	create(payload: CreateBookTypeDTO, transaction?: Transaction<DB>) {
		return this.$create({
			payload: {
				uid: this.uid(),
				...payload,
				createdAt: this.now(),
				updatedAt: this.now(),
			},
			transaction,
		});
	}

	update<Col extends SelectColumn<'book_types'>>(
		where: ReadonlyArray<[Col, SelectValue<'book_types', Col>]>,
		payload: UpdateBookTypeDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			payload: { ...payload, updatedAt: this.now() },
			transaction,
			where,
		});
	}
}
