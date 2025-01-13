import app from '@adonisjs/core/services/app';
import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import UserRepository from '#repositories/user_repository';
import { generateUid } from '#services/uid_generator';

test.group('Password reset', (group) => {
	group.each.setup(() => testUtils.db().truncate());

	test('it should forbid password reset for an unknown email')
		.with([
			{
				email: 'email@email.test',
			},
		])
		.run(async ({ client }, dataRow) => {
			// 1. Given

			// 2. Act
			const response = await client.post('/auth/forgot-password').json({
				email: dataRow.email,
			});

			// 3. Assert
			response.assertStatus(422);
			response.assertBodyContains({});
		});

	test('it should create a password reset token for a known email')
		.with([
			{
				email: 'email@email.test',
				password: 'password',
				roles: ['ROLE_USER'],
				username: 'username',
			},
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			await userRepository.create({ ...dataRow, password: hashedPassword }).returningAllOrThrow();

			// 2. Act
			const response = await client.post('/auth/forgot-password').json({
				email: dataRow.email,
			});

			// 3. Assert
			const resetToken = await userRepository
				.findOneBy([['email', '=', dataRow.email]])
				.select('resetPasswordToken');
			response.assertStatus(204);
			response.assertBodyContains({});
			assert.isDefined(resetToken);
		});

	test('it should not accept a password request if the user is already logged in')
		.with([
			{
				email: 'email@email.test',
				password: 'password',
				roles: ['ROLE_USER'],
				safePassword: '@Saf3P@ssw0rd!?UsedF4Tests',
				username: 'username',
			},
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			const user = await userRepository
				.create({
					email: dataRow.email,
					password: hashedPassword,
					roles: dataRow.roles,
					username: dataRow.username,
				})
				.returningAllOrThrow();

			// 2. Act
			const response = await client
				.post('/auth/forgot-password')
				.json({
					email: dataRow.email,
				})
				.loginAs(user);

			// 3. Assert
			const updatedUser = await userRepository.findOneBy([['id', '=', user.id]]).selectAll();
			response.assertStatus(400);
			response.assertBodyContains({ message: 'Vous êtes déjà connecté.' });
			assert.equal(updatedUser?.resetPasswordToken, null);
		});

	test('it should reset the password of a user')
		.with([
			{
				email: 'email@email.test',
				password: 'password',
				resetPasswordToken: generateUid(),
				roles: ['ROLE_USER'],
				safePassword: '@Saf3P@ssw0rd!?UsedF4Tests',
				username: 'username',
			},
		])
		.run(async ({ client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			const user = await userRepository
				.create({
					email: dataRow.email,
					password: hashedPassword,
					resetPasswordToken: dataRow.resetPasswordToken,
					roles: dataRow.roles,
					username: dataRow.username,
				})
				.returningAllOrThrow();

			// 2. Act
			const response = await client.post(`/auth/reset-password/${user.resetPasswordToken}`).json({
				password: dataRow.safePassword,
			});

			// 3. Assert
			response.assertStatus(200);
			response.assertBodyContains({
				username: dataRow.username,
			});
		});

	test('it should not accept a password reset with an invalid token', async ({ client }) => {
		// 1. Given
		const invalidToken = generateUid();

		// 2. Act
		const response = await client.post(`/auth/reset-password/${invalidToken}`).json({
			password: '@Saf3P@ssw0rd!?UsedF4Tests',
		});

		// 3. Assert
		response.assertStatus(400);
		response.assertBody({ message: 'Aucun utilisateur ne correspond à cette demande.' });
	});

	test('it should not accept a password reset with a malformed token', async ({ client }) => {
		// 1. Given
		const invalidToken = 'invalid-token';

		// 2. Act
		const response = await client.post(`/auth/reset-password/${invalidToken}`).json({
			password: '@Saf3P@ssw0rd!?UsedF4Tests',
		});

		// 3. Assert
		response.assertStatus(422);
		response.assertBody({ errors: [{ message: 'Le token de réinitialisation est invalide.' }] });
	});

	test('it should not update password if the user is already logged in')
		.with([
			{
				email: 'email@email.test',
				password: 'password',
				resetPasswordToken: generateUid(),
				roles: ['ROLE_USER'],
				safePassword: '@Saf3P@ssw0rd!?UsedF4Tests',
				username: 'username',
			},
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const hashedPassword = await hash.make(dataRow.password);
			const user = await userRepository
				.create({
					email: dataRow.email,
					password: hashedPassword,
					resetPasswordToken: dataRow.resetPasswordToken,
					roles: dataRow.roles,
					username: dataRow.username,
				})
				.returningAllOrThrow();

			// 2. Act
			const response = await client
				.post(`/auth/reset-password/${user.resetPasswordToken}`)
				.json({
					password: dataRow.safePassword,
				})
				.loginAs(user);

			// 3. Assert
			const updatedUser = await userRepository.findOneBy([['id', '=', user.id]]).selectAll();
			response.assertStatus(400);
			response.assertBodyContains({ message: 'Vous êtes déjà connecté.' });
			assert.equal(updatedUser?.password, user.password);
		});
});
