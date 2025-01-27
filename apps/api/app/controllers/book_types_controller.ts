import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';

import BookTypeRepository from '#repositories/book_type_repository';
import { createBookTypeValidator, updateBookTypeValidator } from '#validators/book_type';

@inject()
export default class BookTypesController {
	constructor(private readonly bookTypeRepository: BookTypeRepository) {}

	async index({ bouncer, response }: HttpContext) {
		if (await bouncer.with('BookTypePolicy').denies('index')) {
			return response.forbidden({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
		}

		const bookTypes = await this.bookTypeRepository.findAll().select('name', 'uid');

		return response.ok(bookTypes);
	}

	async store({ bouncer, request, response }: HttpContext) {
		if (await bouncer.with('BookTypePolicy').denies('create')) {
			return response.forbidden({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
		}

		const payload = await request.validateUsing(createBookTypeValidator);

		const bookType = await this.bookTypeRepository.create(payload).returning('uid', 'name');

		return response.created(bookType);
	}

	async update({ bouncer, params, request, response }: HttpContext) {
		if (await bouncer.with('BookTypePolicy').denies('update')) {
			return response.forbidden({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
		}

		const bookType = await this.bookTypeRepository
			.findOneByOrFail([['uid', '=', params.uid]])
			.select('id');

		const payload = await request.validateUsing(updateBookTypeValidator, {
			meta: { id: bookType.id },
		});

		const updatedBookType = await this.bookTypeRepository
			.update([['id', bookType.id]], payload)
			.returning('uid', 'name');

		return response.ok(updatedBookType);
	}

	async destroy({ bouncer, params, response }: HttpContext) {
		if (await bouncer.with('BookTypePolicy').denies('delete')) {
			return response.forbidden({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
		}

		const bookType = await this.bookTypeRepository
			.findOneByOrFail([['uid', '=', params.uid]])
			.select('id');

		await this.bookTypeRepository.delete([['id', bookType.id]]).execute();

		return response.noContent();
	}
}
