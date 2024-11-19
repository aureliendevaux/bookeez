import type { HttpContext } from '@adonisjs/core/http';

import { inject } from '@adonisjs/core';

import { AuthService } from '#services/auth_service';
import { loginValidator } from '#validators/login';

@inject()
export default class LoginController {
	constructor(private readonly authService: AuthService) {}

	async handle({ auth, request, response }: HttpContext) {
		const { email, password } = await request.validateUsing(loginValidator);
		const user = await this.authService.verifyCredentials(email, password);

		await auth.use('web').login(user);

		return response.json({
			uid: user.uid,
			roles: user.roles,
			username: user.username,
		});
	}
}
