import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';
import hash from '@adonisjs/core/services/hash';
import vine from '@vinejs/vine';

import UserRepository from '#repositories/user_repository';
import { resetPasswordValidator } from '#validators/auth/reset_password';

@inject()
export default class ResetPasswordController {
	constructor(private readonly userRepository: UserRepository) {}

	async handle({ auth, params, request, response }: HttpContext) {
		const [errors] = await vine.compile(vine.string().isUuid()).tryValidate(params.token);

		if (errors !== null) {
			return response.unprocessableEntity({
				errors: [{ message: 'Le token de réinitialisation est invalide.' }],
			});
		}

		if (auth.use('web').isAuthenticated) {
			return response.badRequest({ message: 'Vous êtes déjà connecté.' });
		}

		const payload = await request.validateUsing(resetPasswordValidator);

		const user = await this.userRepository
			.findOneBy([['resetPasswordToken', '=', params.token]])
			.selectAll();

		if (!user) {
			return response.badRequest({ message: 'Aucun utilisateur ne correspond à cette demande.' });
		}

		const updatedUser = await this.userRepository
			.update([['id', user.id]], {
				password: await hash.make(payload.password),
			})
			.returningAll();

		if (!updatedUser) {
			return response.badRequest('Aucun utilisateur trouvé.');
		}

		await auth.use('web').login(updatedUser);

		return response.ok({
			uid: updatedUser.uid,
			username: updatedUser.username,
		});
	}
}
