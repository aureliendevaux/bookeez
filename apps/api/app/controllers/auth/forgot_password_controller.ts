import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import router from '@adonisjs/core/services/router';
import mail from '@adonisjs/mail/services/main';

import ResetPasswordNotification from '#mails/reset_password_notification';
import UserRepository from '#repositories/user_repository';
import { generateUid } from '#services/uid_generator';
import env from '#start/env';
import { forgotPasswordValidator } from '#validators/auth/forgot_password';

@inject()
export default class ForgotPasswordController {
	constructor(private readonly userRepository: UserRepository) {}

	async handle({ response, request }: HttpContext) {
		const payload = await request.validateUsing(forgotPasswordValidator);

		const updateQuery = await this.userRepository
			.update([['email', payload.email]], {
				resetPasswordToken: generateUid(),
			})
			.returning('resetPasswordToken');

		const token = updateQuery?.resetPasswordToken;

		if (!token) {
			return response.badRequest({
				message: 'Impossible de réinitialiser ton mot de passe',
			});
		}

		const resetLink = router
			.builder()
			.prefixUrl(env.get('FRONTEND_HOST'))
			.params({
				token: token,
			})
			.make('auth.password.reset');

		await mail.send(new ResetPasswordNotification(payload.email, resetLink));
	}
}
