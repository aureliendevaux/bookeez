import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';

import PublisherRepository from '#repositories/publisher_repository';
import PublisherUserRepository from '#repositories/publisher_user_repository';
import UserRepository from '#repositories/user_repository';
import { createPublisherValidator, updatePublisherValidator } from '#validators/publisher';

@inject()
export default class PublishersController {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly publisherRepository: PublisherRepository,
		private readonly publisherUserRepository: PublisherUserRepository,
	) {}

	async index({ bouncer, response }: HttpContext) {
		if (await bouncer.with('PublisherPolicy').denies('index')) {
			return response.forbidden({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
		}

		const publishers = await this.publisherRepository
			.findAll()
			.select('uid', 'name', 'website', 'createdAt');

		return response.ok(publishers);
	}

	async store({ bouncer, request, response }: HttpContext) {
		if (await bouncer.with('PublisherPolicy').denies('create')) {
			return response.forbidden({
				message: 'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
		}

		try {
			const payload = await request.validateUsing(createPublisherValidator);

			const publisher = await this.publisherRepository
				.create({
					name: payload.name,
					website: payload.website,
				})
				.returningAll();

			if (!publisher) {
				return response.internalServerError({
					message: "Une erreur est survenue lors de la maison d'édition",
				});
			}

			const publisherUser = await this.userRepository
				.findOneBy([['uid', '=', payload.publisherUserUid]])
				.select('id', 'roles');

			if (!publisherUser) {
				return response.notFound({
					message: "L'utilisateur n'existe pas",
				});
			}

			await this.publisherUserRepository
				.create({ publisherId: publisher.id, userId: publisherUser.id })
				.returningAll();

			const updatedRoles = [...publisherUser.roles, 'ROLE_PUBLISHER'];
			await this.userRepository.update([['id', publisherUser.id]], { roles: updatedRoles }).returningAll();

			return response.created({
				uid: publisher.uid,
				name: publisher.name,
				website: publisher.website,
			});

		} catch (error) {
			console.error('Validation error:', error);
			return response.unprocessableEntity({ message: 'Validation failed', errors: error.messages });
		}
	}

	async update({ bouncer, params, request, response }: HttpContext) {
		const publisher = await this.publisherRepository
			.findOneByOrFail([['uid', '=', params.uid]])
			.selectAll();

		if (await bouncer.with('PublisherPolicy').denies('update', publisher)) {
			return response.forbidden({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
		}

		const payload = await request.validateUsing(updatePublisherValidator, {
			meta: { id: publisher.id },
		});

		const updatedPublisher = await this.publisherRepository
			.update([['id', publisher.id]], payload)
			.returningAll();

		if (!updatedPublisher) {
			return response.internalServerError({
				message: "Une erreur est survenue lors de la modification de la maison d'édition",
			});
		}

		return response.ok({
			uid: updatedPublisher.uid,
			name: updatedPublisher.name,
			website: updatedPublisher.website,
		});
	}

	async destroy({ bouncer, params, response }: HttpContext) {
		const publisher = await this.publisherRepository
			.findOneByOrFail([['uid', '=', params.uid]])
			.selectAll();

		if (await bouncer.with('PublisherPolicy').denies('delete', publisher)) {
			return response.forbidden({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
		}

		const deletedPublisher = await this.publisherRepository
			.delete([['id', publisher.id]])
			.returningAll();

		if (!deletedPublisher) {
			return response.internalServerError({
				message: "Une erreur est survenue lors de la suppression de la maison d'édition",
			});
		}

		return response.noContent();
	}
}
