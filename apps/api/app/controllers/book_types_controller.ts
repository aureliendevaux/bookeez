import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';

import BookTypeRepository from '#repositories/book_type_repository';
import { createBookTypeValidator, updateBookTypeValidator } from '#validators/book_type';

@inject()
export default class BookTypesController {
    constructor(private readonly bookTypeRepository: BookTypeRepository) {}

    async destroy({ auth, params, response }: HttpContext) {
        if (!auth.user || !auth.user.roles.includes('ROLE_ADMIN')) {
            return response.forbidden({
                message: 'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
            });
        }

        const bookType = await this.bookTypeRepository.findOneByOrFail([['uid', '=', params.uid]]).select('id');

        await this.bookTypeRepository.delete([['id', bookType.id]]).execute();

        return response.noContent();
    }

    async index({ response }: HttpContext) {
        const bookTypes = await this.bookTypeRepository.findAll().select('name', 'uid');

        return response.ok(bookTypes);
    }

    async store({ auth, request, response }: HttpContext) {
        if (!auth.user || !auth.user.roles.includes('ROLE_ADMIN')) {
            return response.forbidden({
                message: 'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
            });
        }

        const payload = await request.validateUsing(createBookTypeValidator);
        const bookType = await this.bookTypeRepository.create(payload).returning('uid', 'name');

        return response.created(bookType);
    }

    async update({ auth, params, request, response }: HttpContext) {
        if (!auth.user || !auth.user.roles.includes('ROLE_ADMIN')) {
            return response.forbidden({
                message: 'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
            });
        }

        const bookType = await this.bookTypeRepository.findOneByOrFail([['uid', '=', params.uid]]).select('id');
        const payload = await request.validateUsing(updateBookTypeValidator, { meta: { id: bookType.id } });

        const updatedBookType = await this.bookTypeRepository
            .update([['id', bookType.id]], payload)
            .returning('uid', 'name');

        return response.ok(updatedBookType);
    }
}