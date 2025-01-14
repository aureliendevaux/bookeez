import app from '@adonisjs/core/services/app';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import BookTypeRepository from '#repositories/book_type_repository';
import UserRepository from '#repositories/user_repository';

test.group('Book Types', (group) => {
	group.each.setup(() => testUtils.db().truncate());

	test('it should list all book types in database', async ({ assert, client }) => {
		// 1. Given
		const userRepository = await app.container.make(UserRepository);
		const bookTypeRepository = await app.container.make(BookTypeRepository);
		const user = await userRepository
			.create({
				email: 'email@email.test',
				password: 'password',
				roles: ['ROLE_USER'],
				username: 'username',
			})
			.returningAllOrThrow();

		// 2. Act
		const rowsCount = await bookTypeRepository.count('id');
		const response = await client.get('/book-types').loginAs(user);

		// 3. Assert
		response.assertStatus(200);
		const responseBody = response.response.body as Array<unknown>;
		assert.isArray(responseBody);
		assert.lengthOf(responseBody, rowsCount);
	});

	test('it should create a new book type')
		.with([{ name: 'mon type de livre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const bookTypeRepository = await app.container.make(BookTypeRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_ADMIN'],
					username: 'username',
				})
				.returningAllOrThrow();
			const beforeCount = await bookTypeRepository.count('id');

			// 2. Act
			const response = await client
				.post('/book-types')
				.json({
					name: dataRow.name,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await bookTypeRepository.count('id');
			response.assertStatus(201);
			response.assertBodyContains({
				name: dataRow.name,
			});
			assert.equal(afterCount, beforeCount + 1);
		});

	test('it should not create a book type with the same name')
		.with([{ name: 'mon type de livre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const bookTypeRepository = await app.container.make(BookTypeRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_ADMIN'],
					username: 'username',
				})
				.returningAllOrThrow();
			await bookTypeRepository.create({ name: dataRow.name }).returningOrThrow('uid');
			const beforeCount = await bookTypeRepository.count('id');

			// 2. Act
			const response = await client
				.post('/book-types')
				.json({
					name: dataRow.name,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await bookTypeRepository.count('id');
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

	test('it should update a book type by its uid')
		.with([{ name: 'mon type de livre', updatedName: 'mon type de livre modifié' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const repository = await app.container.make(UserRepository);
			const bookTypeRepository = await app.container.make(BookTypeRepository);
			const user = await repository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_ADMIN'],
					username: 'username',
				})
				.returningAllOrThrow();
			const bookType = await bookTypeRepository
				.create({ name: dataRow.name })
				.returningOrThrow('uid');
			const beforeCount = await bookTypeRepository.count('id');

			// 2. Act
			const response = await client
				.put(`/book-types/${bookType.uid}`)
				.json({
					name: dataRow.updatedName,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await bookTypeRepository.count('id');
			response.assertStatus(200);
			response.assertBodyContains({
				name: dataRow.updatedName,
			});
			assert.equal(afterCount, beforeCount);
		});

	test('it should update a book type by its uid even with the same content')
		.with([{ name: 'mon type de livre', updatedName: 'mon type de livre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const repository = await app.container.make(UserRepository);
			const bookTypeRepository = await app.container.make(BookTypeRepository);
			const user = await repository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_ADMIN'],
					username: 'username',
				})
				.returningAllOrThrow();
			const bookType = await bookTypeRepository
				.create({ name: dataRow.name })
				.returningOrThrow('uid');
			const beforeCount = await bookTypeRepository.count('id');

			// 2. Act
			const response = await client
				.put(`/book-types/${bookType.uid}`)
				.json({
					name: dataRow.updatedName,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await bookTypeRepository.count('id');
			response.assertStatus(200);
			response.assertBodyContains({
				name: dataRow.updatedName,
			});
			assert.equal(afterCount, beforeCount);
		});

	test('it should delete a book type by its uid')
		.with([{ name: 'mon type de livre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const repository = await app.container.make(UserRepository);
			const bookTypeRepository = await app.container.make(BookTypeRepository);
			const user = await repository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_ADMIN'],
					username: 'username',
				})
				.returningAllOrThrow();
			const bookType = await bookTypeRepository
				.create({ name: dataRow.name })
				.returningOrThrow('uid');
			const beforeCount = await bookTypeRepository.count('id');

			// 2. Act
			const response = await client.delete(`/book-types/${bookType.uid}`).loginAs(user);

			// 3. Assert
			const afterCount = await bookTypeRepository.count('id');
			response.assertStatus(204);
			assert.equal(afterCount, beforeCount - 1);
		});

	test('it should not create a new book type when user does not have the role ROLE_ADMIN')
		.with([{ name: 'mon type de livre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const bookTypeRepository = await app.container.make(BookTypeRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const beforeCount = await bookTypeRepository.count('id');

			// 2. Act
			const response = await client
				.post('/book-types')
				.json({
					name: dataRow.name,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await bookTypeRepository.count('id');
			response.assertStatus(403);
			response.assertBodyContains({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
			assert.equal(afterCount, beforeCount);
		});

	test('it should not update a book type by its uid when user does not have the role ROLE_ADMIN')
		.with([{ name: 'mon type de livre', updatedName: 'mon type de livre modifié' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const repository = await app.container.make(UserRepository);
			const bookTypeRepository = await app.container.make(BookTypeRepository);
			const user = await repository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const bookType = await bookTypeRepository
				.create({ name: dataRow.name })
				.returningOrThrow('uid');
			const beforeCount = await bookTypeRepository.count('id');

			// 2. Act
			const response = await client
				.put(`/book-types/${bookType.uid}`)
				.json({
					name: dataRow.updatedName,
				})
				.loginAs(user);

			// 3. Assert
			const afterBookType = await bookTypeRepository
				.findOneByOrFail([['uid', '=', bookType.uid]])
				.selectAll();
			const afterCount = await bookTypeRepository.count('id');
			response.assertStatus(403);
			response.assertBodyContains({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
			assert.equal(afterCount, beforeCount);
			assert.equal(afterBookType.name, dataRow.name);
		});

	test('it should not delete a book type by its uid when user does not have the role ROLE_ADMIN')
		.with([{ name: 'mon type de livre' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const repository = await app.container.make(UserRepository);
			const bookTypeRepository = await app.container.make(BookTypeRepository);
			const user = await repository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const bookType = await bookTypeRepository
				.create({ name: dataRow.name })
				.returningOrThrow('uid');
			const beforeCount = await bookTypeRepository.count('id');

			// 2. Act
			const response = await client.delete(`/book-types/${bookType.uid}`).loginAs(user);

			// 3. Assert
			const afterCount = await bookTypeRepository.count('id');
			response.assertStatus(403);
			response.assertBodyContains({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
			assert.equal(afterCount, beforeCount);
		});
});
