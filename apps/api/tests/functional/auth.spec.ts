import app from '@adonisjs/core/services/app';
import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import UserRepository from '#repositories/user_repository';

test.group('Auth', (group) => {
	group.each.setup(() => testUtils.db().truncate());

	test('it should log in an existing user')
		.with([
			{
				email: 'email@email.test',
				password: 'password',
				roles: ['ROLE_USER'],
				username: 'username',
			},
		])
		.run(async ({ client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			await userRepository.create({ ...dataRow, password: hashedPassword }).returningAllOrThrow();

			// 2. Act
			const response = await client.post('/auth/login').json({
				email: dataRow.email,
				password: dataRow.password,
			});

			// 3. Assert
			response.assertStatus(200);
			response.assertCookie('remember_web');
			response.assertCookie('adonis-session');
			response.assertBodyContains({
				roles: dataRow.roles,
				username: dataRow.username,
			});
		});

	test('it should not log in with invalid credentials')
		.with([{ email: 'email@email.test', password: 'password' }])
		.run(async ({ client }, dataRow) => {
			// 2. Act
			const response = await client.post('/auth/login').json({
				email: dataRow.email,
				password: dataRow.password,
			});

			// 3. Assert
			response.assertStatus(400);
			response.assertBodyContains({
				errors: [
					{
						message: 'Invalid credentials',
					},
				],
			});
		});

	test('it should log out an authenticated user')
		.with([
			{
				email: 'email@email.test',
				password: 'password',
				roles: ['ROLE_USER'],
				username: 'username',
			},
		])
		.run(async ({ client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			const user = await userRepository
				.create({ ...dataRow, password: hashedPassword })
				.returningAllOrThrow();

			// 2. Act
			const response = await client.post('/auth/logout').loginAs(user);

			// 3. Assert
			response.assertStatus(204);
			response.assertBody({});
		});

	test('it should not log out an unauthenticated user', async ({ client }) => {
		// 1. Given

		// 2. Act
		const response = await client.post('/auth/logout');

		// 3. Assert
		response.assertStatus(401);
		response.assertBody({
			errors: [{ message: 'Unauthorized access' }],
		});
	});

	test('it should check status of an authenticated user')
		.with([
			{
				email: 'email@email.test',
				password: 'password',
				roles: ['ROLE_USER'],
				username: 'username',
			},
		])
		.run(async ({ client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			const user = await userRepository
				.create({ ...dataRow, password: hashedPassword })
				.returningAllOrThrow();

			// 2. Act
			const response = await client.get('/auth/check').loginAs(user);

			// 3. Assert
			response.assertStatus(200);
			response.assertBodyContains({
				roles: dataRow.roles,
				username: dataRow.username,
			});
		});

	test('it should invalidate check of an unauthenticated user', async ({ client }) => {
		// 1. Given

		// 2. Act
		const response = await client.get('/auth/check');

		// 3. Assert
		response.assertStatus(401);
		response.assertBody({});
	});
});
