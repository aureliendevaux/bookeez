import { Transaction } from 'kysely';

import type { CommonFields } from '#types/index';

import AbstractRepository, {
	type SelectColumn,
	type SelectValue,
} from '#repositories/abstract_repository';
import { type DB, Publisher } from '#types/db';

type CreatePublisherDTO = Omit<Publisher.Create, CommonFields>;
type UpdatePublisherDTO = Omit<Publisher.Update, CommonFields>;

export default class PublisherRepository extends AbstractRepository<'publishers'> {
	constructor() {
		super('publishers');
	}

	create(payload: CreatePublisherDTO, transaction?: Transaction<DB>) {
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

	update<Col extends SelectColumn<'publishers'>>(
		where: ReadonlyArray<[Col, SelectValue<'publishers', Col>]>,
		payload: UpdatePublisherDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			payload: { ...payload, updatedAt: this.now() },
			transaction,
			where,
		});
	}
}
