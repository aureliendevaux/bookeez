import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import hash from '@adonisjs/core/services/hash';

import UserRepository from '#repositories/user_repository';
import { registerValidator } from '#validators/register';

@inject()
export default class RegisterController {
	constructor(private readonly userRepository: UserRepository) {}

	async handle({ auth, response, request }: HttpContext) {
		// Valider la requête
		const payload = await request.validateUsing(registerValidator);

		// Créer le user (en hashant le mot de passe)
		const user = await this.userRepository
			.create({
				email: payload.email,
				username: payload.username,
				password: await hash.make(payload.password),
				roles: ['ROLE_USER'],
			})
			.returningAll();

		if (!user) {
			return response.badRequest({
				message: 'Impossible to create this user.',
			});
		}

		// Connexion
		await auth.use('web').login(user);

		return response.created({
			uid: user.uid,
			username: user.username,
			roles: user.roles,
		});
	}
}
