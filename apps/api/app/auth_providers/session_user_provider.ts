import type { Secret } from '@adonisjs/core/helpers';

import { errors, symbols } from '@adonisjs/auth';
import { RememberMeToken } from '@adonisjs/auth/session';
import {
	SessionGuardUser,
	SessionWithTokensUserProviderContract,
} from '@adonisjs/auth/types/session';
import { RuntimeException } from '@adonisjs/core/exceptions';
import app from '@adonisjs/core/services/app';
import hash from '@adonisjs/core/services/hash';

import type { User } from '#types/db';

import RememberMeTokenRepository from '#repositories/remember_me_token_repository';
import UserRepository from '#repositories/user_repository';
import { date } from '#services/date_factory';
import { db } from '#services/db';

export class SessionKyselyUserProvider implements SessionWithTokensUserProviderContract<User.Row> {
	declare [symbols.PROVIDER_REAL_USER]: User.Row;

	async createRememberToken(user: User.Row, expiresIn: number | string): Promise<RememberMeToken> {
		const transientToken = RememberMeToken.createTransientToken(user.id, 40, expiresIn);
		const rememberMeTokenRepository = await app.container.make(RememberMeTokenRepository);

		const token = await rememberMeTokenRepository
			.create({
				expiresAt: date(transientToken.expiresAt).toSQL(),
				hash: transientToken.hash,
				tokenableId: user.id,
			})
			.returningAllOrThrow();

		return new RememberMeToken({
			createdAt: token.createdAt,
			expiresAt: transientToken.expiresAt,
			hash: transientToken.hash,
			identifier: token.uid,
			secret: transientToken.secret,
			tokenableId: user.id,
			updatedAt: token.updatedAt,
		});
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async createUserForGuard(user: User.Row): Promise<SessionGuardUser<User.Row>> {
		return {
			getId() {
				return user.id;
			},
			getOriginal() {
				return user;
			},
		};
	}

	async deleteRemeberToken(
		user: User.Row,
		tokenIdentifier: bigint | number | string,
	): Promise<number> {
		if (typeof tokenIdentifier !== 'string') {
			throw new RuntimeException('Remember me token identifier must be a string');
		}

		const rememberMeTokenRepository = await app.container.make(RememberMeTokenRepository);
		const deletion = await rememberMeTokenRepository
			.delete([
				['uid', tokenIdentifier],
				['tokenableId', user.id],
			])
			.executeTakeFirst();

		return Number(deletion.numDeletedRows);
	}

	async findById(identifier: number): Promise<null | SessionGuardUser<User.Row>> {
		const user = await db
			.selectFrom('users')
			.selectAll()
			.where('id', '=', identifier)
			.executeTakeFirst();

		if (!user) {
			return null;
		}

		return this.createUserForGuard(user);
	}

	async recycleRememberToken(
		user: User.Row,
		tokenIdentifier: bigint | number | string,
		expiresIn: number | string,
	): Promise<RememberMeToken> {
		await this.deleteRemeberToken(user, tokenIdentifier);
		return this.createRememberToken(user, expiresIn);
	}

	async verifyCredentials(username: string, password: string): Promise<User.Row> {
		const userRepository = await app.container.make(UserRepository);
		const user = await userRepository.findOneBy([['email', '=', username]]).selectAll();

		if (undefined === user) {
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

	async verifyRememberToken(tokenValue: Secret<string>): Promise<null | RememberMeToken> {
		const rememberMeTokenRepository = await app.container.make(RememberMeTokenRepository);
		const decodedToken = RememberMeToken.decode(tokenValue.release());

		if (!decodedToken) {
			return null;
		}

		const token = await rememberMeTokenRepository.find('uid', decodedToken.identifier).selectAll();

		if (!token) {
			return null;
		}

		const rememberMeToken = new RememberMeToken({
			createdAt: token.createdAt,
			expiresAt: token.expiresAt,
			hash: token.hash,
			identifier: token.uid,
			tokenableId: token.tokenableId,
			updatedAt: token.updatedAt,
		});

		const tokenIsVerified = rememberMeToken.verify(decodedToken.secret);

		if (!tokenIsVerified || rememberMeToken.isExpired()) {
			return null;
		}

		return rememberMeToken;
	}
}
