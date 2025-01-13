import type { CommandOptions } from '@adonisjs/core/types/ace';

import { inject } from '@adonisjs/core';
import { BaseCommand } from '@adonisjs/core/ace';
import hash from '@adonisjs/core/services/hash';

import UserRepository from '#repositories/user_repository';
import env from '#start/env';

export default class AppDefaults extends BaseCommand {
	static readonly commandName = 'app:defaults';
	static readonly description = 'Generate base data for the app';
	static readonly options: CommandOptions = {
		startApp: true,
	};

	@inject()
	async run(userRepository: UserRepository) {
		await this.#createUsers(userRepository);
	}

	async #createUsers(userRepository: UserRepository) {
		return userRepository
			.create({
				email: env.get('GOD_EMAIL'),
				password: await hash.make(env.get('GOD_PASSWORD')),
				roles: ['ROLE_GOD'],
				username: env.get('GOD_USERNAME'),
			})
			.returning('id');
	}
}
