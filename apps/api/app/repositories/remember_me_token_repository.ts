import type { Transaction } from 'kysely';

import type { DB, RememberMeToken } from '#types/db';
import type { CommonFields } from '#types/index';

import AbstractRepository from '#repositories/abstract_repository';
import { date } from '#services/date_factory';
import { generateUid } from '#services/uid_generator';

type CreateRememberMeTokenDTO = Omit<RememberMeToken.Create, CommonFields>;

export default class RememberMeTokenRepository extends AbstractRepository<'remember_me_tokens'> {
	constructor() {
		super('remember_me_tokens');
	}

	create(payload: CreateRememberMeTokenDTO, transaction?: Transaction<DB>) {
		return this.$create({
			payload: {
				createdAt: this.now(),
				expiresAt: date(payload.expiresAt).toSQL(),
				hash: payload.hash,
				tokenableId: payload.tokenableId,
				uid: generateUid(),
				updatedAt: this.now(),
			},
			transaction,
		});
	}
}
