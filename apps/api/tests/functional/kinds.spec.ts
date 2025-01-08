import { test } from '@japa/runner';

import { Database } from '#database/db';
import KindRepository from '#repositories/kind_repository';
import UserRepository from '#repositories/user_repository';

test.group('Genres', () => {
	test('it should list all kinds in database', async ({ client }) => {
		// 1. Given
		const database = new Database();
		const repository = new UserRepository(database);
		const user = await repository.findBy([['username', 'username']]).selectAllTakeFirst();

		// 2. Act
		const response = await client.get('/kinds').loginAs(user!);

		// 3. Assert
		response.assertStatus(200);
		// response.assertBody([]);
	});

	test('it should create a new kind', async ({ client }) => {
		// 1. Given
		const database = new Database();
		const repository = new UserRepository(database);
		const user = await repository.findBy([['username', 'username']]).selectAllTakeFirst();
		const kindName = 'mon genre ' + Date.now();

		// 2. Act
		const response = await client
			.post('/kinds')
			.json({
				name: kindName,
			})
			.loginAs(user!);

		response.assertStatus(201);
		response.assertBodyContains({
			name: kindName,
		});
	});

	test('it should update a kind by its uid', async ({ client }) => {
		// 1. Given
		const database = new Database();
		const repository = new UserRepository(database);
		const user = await repository.findBy([['username', 'username']]).selectAllTakeFirst();

		const kindRepository = new KindRepository(database);
		const kindName = 'mon genre ' + Date.now();
		const kind = await kindRepository.create({ name: kindName }).returningAll();
		const newKindName = 'new name ' + Date.now();

		// 2. Act
		const response = await client
			.put(`/kinds/${kind!.uid}`)
			.json({
				name: newKindName,
			})
			.loginAs(user!);

		// 3. Assert
		response.assertStatus(200);
		response.assertBodyContains({
			name: newKindName,
		});
	});

	test('it should delete a kind by its uid', async ({ client }) => {
		// 1. Given
		const database = new Database();
		const repository = new UserRepository(database);
		const user = await repository.findBy([['username', 'username']]).selectAllTakeFirst();

		const kindRepository = new KindRepository(database);
		const kindName = 'mon genre ' + Date.now();
		const kind = await kindRepository.create({ name: kindName }).returningAll();

		// 2. Act
		const response = await client.delete(`/kinds/${kind!.uid}`).loginAs(user!);

		// 3. Assert
		response.assertStatus(204);
	});
});
