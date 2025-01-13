import { Transaction } from 'kysely';

import type { CommonFields } from '#types/index';

import AbstractRepository, {
	type SelectColumn,
	type SelectValue,
} from '#repositories/abstract_repository';
import { type DB, Kind } from '#types/db';

type CreateKindDTO = Omit<Kind.Create, CommonFields>;
type UpdateKindDTO = Omit<Kind.Update, CommonFields>;

export default class KindRepository extends AbstractRepository<'kinds'> {
	constructor() {
		super('kinds');
	}

	create(payload: CreateKindDTO, transaction?: Transaction<DB>) {
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

	update<Col extends SelectColumn<'kinds'>>(
		where: ReadonlyArray<[Col, SelectValue<'kinds', Col>]>,
		payload: UpdateKindDTO,
		transaction?: Transaction<DB>,
	) {
		return this.$update({
			payload: { ...payload, updatedAt: this.now() },
			transaction,
			where,
		});
	}
}
