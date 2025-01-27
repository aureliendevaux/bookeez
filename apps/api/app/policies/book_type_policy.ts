import { BasePolicy } from '@adonisjs/bouncer';
import { AuthorizerResponse } from '@adonisjs/bouncer/types';

import { User } from '#types/db';

export default class BookTypePolicy extends BasePolicy {
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
	update(user: User.Row): AuthorizerResponse {
		return user?.roles.includes('ROLE_ADMIN');
	}

	// eslint-disable-next-line sonarjs/function-return-type
	delete(user: User.Row): AuthorizerResponse {
		return user?.roles.includes('ROLE_ADMIN');
	}
}
