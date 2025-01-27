import app from '@adonisjs/core/services/app';
import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import UserRepository from '#repositories/user_repository';

test.group('Registration', (group) => {
	group.each.setup(() => testUtils.db().truncate());

	test('it should register a new user with free email and username')
		.with([
			{
				email: 'email@email.test',
				password: '@Saf3P@ssw0rd!?UsedF4Tests',
				roles: ['ROLE_USER'],
				username: 'username',
			},
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const beforeCount = await userRepository.count('id');

			// 2. Act
			const response = await client.post('/auth/register').json({
				email: dataRow.email,
				password: dataRow.password,
				password_confirmation: dataRow.password,
				username: dataRow.username,
			});

			// 3. Assert
			const afterCount = await userRepository.count('id');
			const user = await userRepository.findOneBy([['email', '=', dataRow.email]]).selectAll();
			response.assertStatus(201);
			response.assertCookie('remember_web');
			response.assertCookie('adonis-session');
			response.assertBodyContains({
				roles: dataRow.roles,
				username: dataRow.username,
			});
			assert.isDefined(user);
			assert.equal(user?.email, dataRow.email);
			assert.equal(user?.username, dataRow.username);
			assert.equal(afterCount, beforeCount + 1);
		});

	test('it should not register a new user with already used email')
		.with([
			{
				email: 'email@email.test',
				password: '@Saf3P@ssw0rd!?UsedF4Tests',
				roles: ['ROLE_USER'],
				username: 'username',
			},
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			await userRepository.create({ ...dataRow, password: hashedPassword }).returningAllOrThrow();
			const beforeCount = await userRepository.count('id');

			// 2. Act
			const response = await client.post('/auth/register').json({
				email: dataRow.email,
				password: dataRow.password,
				password_confirmation: dataRow.password,
				username: dataRow.username,
			});

			// 3. Assert
			const afterCount = await userRepository.count('id');
			response.assertStatus(422);
			response.assertBodyContains({
				errors: [
					{
						field: 'email',
						message: 'The email has already been taken',
						rule: 'database.unique',
					},
				],
			});
			assert.equal(afterCount, beforeCount);
		});

	test('it should not register a new user with already used username')
		.with([
			{
				email: 'email@email.test',
				password: '@Saf3P@ssw0rd!?UsedF4Tests',
				roles: ['ROLE_USER'],
				username: 'username',
			},
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			await userRepository.create({ ...dataRow, password: hashedPassword }).returningAllOrThrow();
			const beforeCount = await userRepository.count('id');

			// 2. Act
			const response = await client.post('/auth/register').json({
				email: dataRow.email,
				password: dataRow.password,
				password_confirmation: dataRow.password,
				username: dataRow.username,
			});

			// 3. Assert
			const afterCount = await userRepository.count('id');
			response.assertStatus(422);
			response.assertBodyContains({
				errors: [
					{
						field: 'username',
						message: 'The username has already been taken',
						rule: 'database.unique',
					},
				],
			});
			assert.equal(afterCount, beforeCount);
		});

	test('it should not register a new user when already logged in')
		.with([
			{
				email: 'email@email.test',
				password: '@Saf3P@ssw0rd!?UsedF4Tests',
				roles: ['ROLE_USER'],
				username: 'username',
			},
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			const user = await userRepository
				.create({ ...dataRow, password: hashedPassword })
				.returningAllOrThrow();
			const beforeCount = await userRepository.count('id');

			// 2. Act
			const response = await client
				.post('/auth/register')
				.json({
					email: dataRow.email,
					password: dataRow.password,
					password_confirmation: dataRow.password,
					username: dataRow.username,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await userRepository.count('id');
			response.assertStatus(400);
			response.assertBodyContains({ message: 'Vous êtes déjà connecté.' });
			assert.equal(afterCount, beforeCount);
		});
});
