import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

import UserRepository from '#repositories/user_repository';

@inject()
export default class DeleteAccountController {
	constructor(private readonly userRepository: UserRepository) {}

	async handle({ auth, response }: HttpContext) {
		if (!auth.user) return response.forbidden();

		await this.userRepository.delete([['uid', auth.user.uid]]).execute();

		return response.noContent();
	}
}
