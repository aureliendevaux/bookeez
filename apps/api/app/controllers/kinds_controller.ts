import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';

import KindRepository from '#repositories/kind_repository';
import { createKindValidator, updateKindValidator } from '#validators/kind';

@inject()
export default class KindsController {
	constructor(private readonly kindRepository: KindRepository) {}

	async destroy({ params, response }: HttpContext) {
		const kind = await this.kindRepository.findOneByOrFail([['uid', '=', params.uid]]).select('id');

		await this.kindRepository.delete([['id', kind.id]]).execute();

		return response.noContent();
	}

	async index({ response }: HttpContext) {
		const kinds = await this.kindRepository.findAll().select('name', 'uid');

		return response.ok(kinds);
	}

	async store({ request, response }: HttpContext) {
		const payload = await request.validateUsing(createKindValidator);

		const kind = await this.kindRepository.create(payload).returning('uid', 'name');

		return response.created(kind);
	}

	async update({ params, request, response }: HttpContext) {
		const kind = await this.kindRepository.findOneByOrFail([['uid', '=', params.uid]]).select('id');

		const payload = await request.validateUsing(updateKindValidator, { meta: { id: kind.id } });

		const updatedKind = await this.kindRepository
			.update([['id', kind.id]], payload)
			.returning('uid', 'name');

		return response.ok(updatedKind);
	}
}
