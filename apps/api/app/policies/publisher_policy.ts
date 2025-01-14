import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';
import { inject } from '@adonisjs/core';

import PublisherUserRepository from '#repositories/publisher_user_repository';
import { Publisher, User } from '#types/db';

@inject()
export default class PublisherPolicy extends BasePolicy {
	constructor(private readonly publisherUserRepository: PublisherUserRepository) {
		super();
	}

	// eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
	async before(user: User.Row | null, _action: string, ..._parameters: Array<never>) {
		if (user?.roles.includes('ROLE_ADMIN')) return true;
	}

	// eslint-disable-next-line sonarjs/function-return-type, @typescript-eslint/no-unused-vars
	index(_user: User.Row): AuthorizerResponse {
		return true;
	}

	// eslint-disable-next-line sonarjs/function-return-type
	create(user: User.Row): AuthorizerResponse {
		return user?.roles.includes('ROLE_ADMIN');
	}

	// eslint-disable-next-line sonarjs/function-return-type
	update(user: User.Row, publisher: Publisher.Row): AuthorizerResponse {
		return this.canAccess(user, publisher);
	}

	// eslint-disable-next-line sonarjs/function-return-type
	delete(user: User.Row, publisher: Publisher.Row): AuthorizerResponse {
		return this.canAccess(user, publisher);
	}

	async canAccess(user: User.Row, publisher: Publisher.Row) {
		const associations = await this.publisherUserRepository
			.findBy([
				['userId', '=', user.id],
				['publisherId', '=', publisher.id],
			])
			.selectAll();

		return associations.length > 0;
	}
}
