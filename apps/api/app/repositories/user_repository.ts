import { Transaction } from 'kysely';

import type { CommonFields } from '#types/index';

import AbstractRepository, { SelectColumn, SelectValue } from '#repositories/abstract_repository';
import { type DB, User } from '#types/db';

type CreateUserDTO = Omit<User.Create, CommonFields>;
type UpdateUserDTO = Omit<User.Update, CommonFields>;

export default class UserRepository extends AbstractRepository<'users'> {
	constructor() {
		super('users');
	}

	create(payload: CreateUserDTO, transaction?: Transaction<DB>) {
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

	update<Col extends SelectColumn<'users'>>(
		where: ReadonlyArray<[Col, SelectValue<'users', Col>]>,
		payload: UpdateUserDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			payload: { ...payload, updatedAt: this.now() },
			transaction,
			where,
		});
	}
}
