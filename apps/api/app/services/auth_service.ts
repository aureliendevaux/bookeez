import { errors } from '@adonisjs/auth';
import { inject } from '@adonisjs/core';
import hash from '@adonisjs/core/services/hash';

import UserRepository from '#repositories/user_repository';
import { User } from '#types/db';

@inject()
export class AuthService {
	constructor(private readonly userRepository: UserRepository) {}

	async verifyCredentials(email: string, password: string): Promise<User.Row> {
		const user = await this.userRepository.findOneBy([['email', '=', email]]).selectAll();

		if (!user) {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw new errors.E_INVALID_CREDENTIALS('Invalid credentials');
		}

		const passwordVerified = await hash.verify(user.password, password);

		if (!passwordVerified) {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw new errors.E_INVALID_CREDENTIALS('Invalid credentials');
		}

		return user;
	}
}
