import app from '@adonisjs/core/services/app';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import KindRepository from '#repositories/kind_repository';
import UserRepository from '#repositories/user_repository';

test.group('Kinds', (group) => {
	group.each.setup(() => testUtils.db().truncate());

	test('it should list all kinds in database', async ({ assert, client }) => {
		// 1. Given
		const userRepository = await app.container.make(UserRepository);
		const kindRepository = await app.container.make(KindRepository);
		const user = await userRepository
			.create({
				email: 'email@email.test',
				password: 'password',
				roles: ['ROLE_USER'],
				username: 'username',
			})
			.returningAllOrThrow();

		// 2. Act
		const rowsCount = await kindRepository.count('id');
		const response = await client.get('/kinds').loginAs(user);

		// 3. Assert
		response.assertStatus(200);
		const responseBody = response.response.body as Array<unknown>;
		assert.isArray(responseBody);
		assert.lengthOf(responseBody, rowsCount);
	});

	test('it should create a new kind')
		.with([{ name: 'mon genre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const kindRepository = await app.container.make(KindRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const beforeCount = await kindRepository.count('id');

			// 2. Act
			const response = await client
				.post('/kinds')
				.json({
					name: dataRow.name,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await kindRepository.count('id');
			response.assertStatus(201);
			response.assertBodyContains({
				name: dataRow.name,
			});
			assert.equal(afterCount, beforeCount + 1);
		});

	test('it should not create a kind with the same name')
		.with([{ name: 'mon genre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const kindRepository = await app.container.make(KindRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			await kindRepository.create({ name: dataRow.name }).returningOrThrow('uid');
			const beforeCount = await kindRepository.count('id');

			// 2. Act
			const response = await client
				.post('/kinds')
				.json({
					name: dataRow.name,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await kindRepository.count('id');
			response.assertStatus(422);
			response.assertBodyContains({
				errors: [
					{
						field: 'name',
						message: 'The name has already been taken',
						rule: 'database.unique',
					},
				],
			});
			assert.equal(afterCount, beforeCount);
		});

	test('it should update a kind by its uid')
		.with([{ name: 'mon genre', updatedName: 'mon genre modifié' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const repository = await app.container.make(UserRepository);
			const kindRepository = await app.container.make(KindRepository);
			const user = await repository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const kind = await kindRepository.create({ name: dataRow.name }).returningOrThrow('uid');
			const beforeCount = await kindRepository.count('id');

			// 2. Act
			const response = await client
				.put(`/kinds/${kind.uid}`)
				.json({
					name: dataRow.updatedName,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await kindRepository.count('id');
			response.assertStatus(200);
			response.assertBodyContains({
				name: dataRow.updatedName,
			});
			assert.equal(afterCount, beforeCount);
		});

	test('it should update a kind by its uid even with the same content')
		.with([{ name: 'mon genre', updatedName: 'mon genre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const repository = await app.container.make(UserRepository);
			const kindRepository = await app.container.make(KindRepository);
			const user = await repository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const kind = await kindRepository.create({ name: dataRow.name }).returningOrThrow('uid');
			const beforeCount = await kindRepository.count('id');

			// 2. Act
			const response = await client
				.put(`/kinds/${kind.uid}`)
				.json({
					name: dataRow.updatedName,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await kindRepository.count('id');
			response.assertStatus(200);
			response.assertBodyContains({
				name: dataRow.updatedName,
			});
			assert.equal(afterCount, beforeCount);
		});

	test('it should delete a kind by its uid')
		.with([{ name: 'mon genre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const repository = await app.container.make(UserRepository);
			const kindRepository = await app.container.make(KindRepository);
			const user = await repository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const kind = await kindRepository.create({ name: dataRow.name }).returningOrThrow('uid');
			const beforeCount = await kindRepository.count('id');

			// 2. Act
			const response = await client.delete(`/kinds/${kind.uid}`).loginAs(user);

			// 3. Assert
			const afterCount = await kindRepository.count('id');
			response.assertStatus(204);
			assert.equal(afterCount, beforeCount - 1);
		});
});
