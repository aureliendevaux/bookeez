import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';

import KindRepository from '#repositories/kind_repository';
import { createKindValidator, updateKindValidator } from '#validators/kind';

@inject()
export default class KindsController {
	constructor(private readonly kindRepository: KindRepository) {}

	async index({ response }: HttpContext) {
		const kinds = await this.kindRepository.findBy([]).select('name', 'uid');

		return response.ok(kinds);
	}

	async store({ request, response }: HttpContext) {
		const payload = await request.validateUsing(createKindValidator);

		const kind = await this.kindRepository.create(payload).returning('uid', 'name');

		return response.created(kind);
	}

	async update({ params, request, response }: HttpContext) {
		const kind = await this.kindRepository.findBy([['uid', params.uid]]).selectTakeFirst('id');

		if (!kind) {
			return response.notFound();
		}

		const payload = await request.validateUsing(updateKindValidator, { meta: { id: kind.id } });

		const updatedKind = await this.kindRepository
			.update([['id', kind.id]], payload)
			.returning('uid', 'name');

		return response.ok(updatedKind);
	}

	async destroy({ params, response }: HttpContext) {
		const kind = await this.kindRepository.findBy([['uid', params.uid]]).selectTakeFirst('id');

		if (!kind) {
			return response.notFound();
		}

		await this.kindRepository.delete([['id', kind.id]]).execute();

		return response.noContent();
	}
}
