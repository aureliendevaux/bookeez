import { Transaction } from 'kysely';

import type { CommonFields } from '#types/index';

import AbstractRepository from '#repositories/abstract_repository';
import { type DB, PublisherUser } from '#types/db';

type CreatePublisherUserDTO = Omit<PublisherUser.Create, CommonFields>;

export default class PublisherUserRepository extends AbstractRepository<'publishers_users'> {
	constructor() {
		super('publishers_users');
	}

	create(payload: CreatePublisherUserDTO, transaction?: Transaction<DB>) {
		return this.$create({
			payload: {
				...payload,
				createdAt: this.now(),
			},
			transaction,
		});
	}
}
