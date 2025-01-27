import app from '@adonisjs/core/services/app';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import PublisherRepository from '#repositories/publisher_repository';
import PublisherUserRepository from '#repositories/publisher_user_repository';
import UserRepository from '#repositories/user_repository';

test.group('Publishers', (group) => {
	group.each.setup(() => testUtils.db().truncate());

	test('when authenticated, it should list all publishers in database', async ({
		assert,
		client,
	}) => {
		// 1. Given
		const userRepository = await app.container.make(UserRepository);
		const publisherRepository = await app.container.make(PublisherRepository);
		const user = await userRepository
			.create({
				email: 'email@email.test',
				password: 'password',
				roles: ['ROLE_USER'],
				username: 'username',
			})
			.returningAllOrThrow();

		// 2. Act
		const rowsCount = await publisherRepository.count('id');
		const response = await client.get('/publishers').loginAs(user);

		// 3. Assert
		response.assertStatus(200);
		const responseBody = response.response.body as Array<unknown>;
		assert.isArray(responseBody);
		assert.lengthOf(responseBody, rowsCount);
	});

	test('when authenticated with admin role, it should create a publisher')
		.with([{ name: "Maison d'édition", website: 'https://google.com' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisherUserRepository = await app.container.make(PublisherUserRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_ADMIN'],
					username: 'username',
				})
				.returningAllOrThrow();
			const publisherBeforeCount = await publisherRepository.count('id');
			const publisherUserBeforeCount = await publisherUserRepository.count('userId');

			// 2. Act
			const response = await client
				.post('/publishers')
				.json({
					name: dataRow.name,
					website: dataRow.website,
					publisherUserUid: user.uid,
				})
				.loginAs(user);

			// 3. Assert
			const publisherAfterCount = await publisherRepository.count('id');
			const publisherUserAfterCount = await publisherUserRepository.count('userId');
			response.assertStatus(201);
			response.assertBodyContains({
				name: dataRow.name,
				website: dataRow.website,
			});
			assert.equal(publisherBeforeCount + 1, publisherAfterCount);
			assert.equal(publisherUserBeforeCount + 1, publisherUserAfterCount);
		});

	test('when authenticated with admin role, it should update a publisher')
		.with([
			{ name: "Maison d'édition", website: 'https://google.com', newWebsite: 'https://google.fr' },
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisherUserRepository = await app.container.make(PublisherUserRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_ADMIN'],
					username: 'username',
				})
				.returningAllOrThrow();
			const publisher = await publisherRepository
				.create({
					name: dataRow.name,
					website: dataRow.website,
				})
				.returningAllOrThrow();
			const publisherBeforeCount = await publisherRepository.count('id');
			const publisherUserBeforeCount = await publisherUserRepository.count('userId');

			// 2. Act
			const response = await client
				.put(`/publishers/${publisher.uid}`)
				.json({
					name: dataRow.name,
					website: dataRow.newWebsite,
				})
				.loginAs(user);

			// 3. Assert
			const publisherAfterCount = await publisherRepository.count('id');
			const publisherUserAfterCount = await publisherUserRepository.count('userId');
			response.assertStatus(200);
			response.assertBodyContains({
				uid: publisher.uid,
				name: dataRow.name,
				website: dataRow.newWebsite,
			});
			assert.equal(publisherBeforeCount, publisherAfterCount);
			assert.equal(publisherUserBeforeCount, publisherUserAfterCount);
		});

	test('when authenticated with with an associated user, it should update a publisher')
		.with([
			{ name: "Maison d'édition", website: 'https://google.com', newWebsite: 'https://google.fr' },
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisherUserRepository = await app.container.make(PublisherUserRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const publisher = await publisherRepository
				.create({
					name: dataRow.name,
					website: dataRow.website,
				})
				.returningAllOrThrow();
			await publisherUserRepository
				.create({
					publisherId: publisher.id,
					userId: user.id,
				})
				.returningAllOrThrow();
			const publisherBeforeCount = await publisherRepository.count('id');
			const publisherUserBeforeCount = await publisherUserRepository.count('userId');

			// 2. Act
			const response = await client
				.put(`/publishers/${publisher.uid}`)
				.json({
					name: dataRow.name,
					website: dataRow.newWebsite,
				})
				.loginAs(user);

			// 3. Assert
			const publisherAfterCount = await publisherRepository.count('id');
			const publisherUserAfterCount = await publisherUserRepository.count('userId');
			response.assertStatus(200);
			response.assertBodyContains({
				uid: publisher.uid,
				name: dataRow.name,
				website: dataRow.newWebsite,
			});
			assert.equal(publisherBeforeCount, publisherAfterCount);
			assert.equal(publisherUserBeforeCount, publisherUserAfterCount);
		});

	test('when authenticated with admin role, it should delete a publisher and its relations')
		.with([
			{ name: "Maison d'édition", website: 'https://google.com', newWebsite: 'https://google.fr' },
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisherUserRepository = await app.container.make(PublisherUserRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_ADMIN'],
					username: 'username',
				})
				.returningAllOrThrow();
			const publisher = await publisherRepository
				.create({
					name: dataRow.name,
					website: dataRow.website,
				})
				.returningAllOrThrow();
			await publisherUserRepository
				.create({
					publisherId: publisher.id,
					userId: user.id,
				})
				.returningAllOrThrow();
			const publisherBeforeCount = await publisherRepository.count('id');
			const publisherUserBeforeCount = await publisherUserRepository.count('userId');

			// 2. Act
			const response = await client.delete(`/publishers/${publisher.uid}`).loginAs(user);

			// 3. Assert
			const publisherAfterCount = await publisherRepository.count('id');
			const publisherUserAfterCount = await publisherUserRepository.count('userId');
			response.assertStatus(204);
			response.assertBody({});
			assert.equal(publisherBeforeCount - 1, publisherAfterCount);
			assert.equal(publisherUserBeforeCount - 1, publisherUserAfterCount);
		});

	test(
		'when authenticated with with an associated user, it should delete a publisher and its relations',
	)
		.with([
			{ name: "Maison d'édition", website: 'https://google.com', newWebsite: 'https://google.fr' },
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisherUserRepository = await app.container.make(PublisherUserRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const publisher = await publisherRepository
				.create({
					name: dataRow.name,
					website: dataRow.website,
				})
				.returningAllOrThrow();
			await publisherUserRepository
				.create({
					publisherId: publisher.id,
					userId: user.id,
				})
				.returningAllOrThrow();
			const publisherBeforeCount = await publisherRepository.count('id');
			const publisherUserBeforeCount = await publisherUserRepository.count('userId');

			// 2. Act
			const response = await client.delete(`/publishers/${publisher.uid}`).loginAs(user);

			// 3. Assert
			const publisherAfterCount = await publisherRepository.count('id');
			const publisherUserAfterCount = await publisherUserRepository.count('userId');
			response.assertStatus(204);
			response.assertBody({});
			assert.equal(publisherBeforeCount - 1, publisherAfterCount);
			assert.equal(publisherUserBeforeCount - 1, publisherUserAfterCount);
		});

	test('when unauthenticated, it should not list all publishers in database', async ({
		client,
	}) => {
		// 2. Act
		const response = await client.get('/publishers');

		// 3. Assert
		response.assertStatus(401);
		response.assertBodyContains({ errors: [{ message: 'Unauthorized access' }] });
	});

	test('when unauthenticated, it should not create a publisher')
		.with([{ name: "Maison d'édition", website: 'https://google.com' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const beforeCount = await publisherRepository.count('id');

			// 2. Act
			const response = await client.post('/publishers').json({
				name: dataRow.name,
				website: dataRow.website,
				publisherUserUid: user.uid,
			});

			// 3. Assert
			const afterCount = await publisherRepository.count('id');
			response.assertStatus(401);
			response.assertBodyContains({ errors: [{ message: 'Unauthorized access' }] });
			assert.equal(beforeCount, afterCount);
		});

	test('when authenticated with bad authorizations, it should not create a publisher')
		.with([{ name: "Maison d'édition", website: 'https://google.com' }])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const beforeCount = await publisherRepository.count('id');

			// 2. Act
			const response = await client
				.post('/publishers')
				.json({
					name: dataRow.name,
					website: dataRow.website,
					publisherUserUid: user.uid,
				})
				.loginAs(user);

			// 3. Assert
			const afterCount = await publisherRepository.count('id');
			response.assertStatus(403);
			response.assertBodyContains({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
			assert.equal(beforeCount, afterCount);
		});

	test('when unauthenticated, it should not update a publisher')
		.with([
			{ name: "Maison d'édition", website: 'https://google.com', newWebsite: 'https://google.fr' },
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisher = await publisherRepository
				.create({
					name: dataRow.name,
					website: dataRow.website,
				})
				.returningAllOrThrow();
			const beforeCount = await publisherRepository.count('id');

			// 2. Act
			const response = await client.put(`/publishers/${publisher.uid}`).json({
				name: dataRow.name,
				website: dataRow.newWebsite,
			});

			// 3. Assert
			const afterCount = await publisherRepository.count('id');
			response.assertStatus(401);
			response.assertBodyContains({ errors: [{ message: 'Unauthorized access' }] });
			assert.equal(beforeCount, afterCount);
		});

	test('when authenticated with with an non-associated user, it should not update a publisher')
		.with([
			{ name: "Maison d'édition", website: 'https://google.com', newWebsite: 'https://google.fr' },
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisherUserRepository = await app.container.make(PublisherUserRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const publisher = await publisherRepository
				.create({
					name: dataRow.name,
					website: dataRow.website,
				})
				.returningAllOrThrow();
			const publisherBeforeCount = await publisherRepository.count('id');
			const publisherUserBeforeCount = await publisherUserRepository.count('userId');

			// 2. Act
			const response = await client
				.put(`/publishers/${publisher.uid}`)
				.json({
					name: dataRow.name,
					website: dataRow.newWebsite,
				})
				.loginAs(user);

			// 3. Assert
			const publisherAfterCount = await publisherRepository.count('id');
			const publisherUserAfterCount = await publisherUserRepository.count('userId');

			response.assertStatus(403);
			response.assertBodyContains({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
			assert.equal(publisherBeforeCount, publisherAfterCount);
			assert.equal(publisherUserBeforeCount, publisherUserAfterCount);
		});

	test('when unauthenticated, it should not delete a publisher')
		.with([
			{ name: "Maison d'édition", website: 'https://google.com', newWebsite: 'https://google.fr' },
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisher = await publisherRepository
				.create({
					name: dataRow.name,
					website: dataRow.website,
				})
				.returningAllOrThrow();
			const beforeCount = await publisherRepository.count('id');

			// 2. Act
			const response = await client.delete(`/publishers/${publisher.uid}`);

			// 3. Assert
			const afterCount = await publisherRepository.count('id');
			response.assertStatus(401);
			response.assertBodyContains({ errors: [{ message: 'Unauthorized access' }] });
			assert.equal(beforeCount, afterCount);
		});

	test('when authenticated with with an non-associated user, it should not delete a publisher')
		.with([
			{ name: "Maison d'édition", website: 'https://google.com', newWebsite: 'https://google.fr' },
		])
		.run(async ({ assert, client }, dataRow) => {
			// 1. Given
			const userRepository = await app.container.make(UserRepository);
			const publisherRepository = await app.container.make(PublisherRepository);
			const publisherUserRepository = await app.container.make(PublisherUserRepository);
			const user = await userRepository
				.create({
					email: 'email@email.test',
					password: 'password',
					roles: ['ROLE_USER'],
					username: 'username',
				})
				.returningAllOrThrow();
			const publisher = await publisherRepository
				.create({
					name: dataRow.name,
					website: dataRow.website,
				})
				.returningAllOrThrow();
			const publisherBeforeCount = await publisherRepository.count('id');
			const publisherUserBeforeCount = await publisherUserRepository.count('userId');

			// 2. Act
			const response = await client.delete(`/publishers/${publisher.uid}`).loginAs(user);

			// 3. Assert
			const publisherAfterCount = await publisherRepository.count('id');
			const publisherUserAfterCount = await publisherUserRepository.count('userId');

			response.assertStatus(403);
			response.assertBodyContains({
				message:
					'Vous devez être connecté et avoir les droits nécessaires pour effectuer cette action',
			});
			assert.equal(publisherBeforeCount, publisherAfterCount);
			assert.equal(publisherUserBeforeCount, publisherUserAfterCount);
		});
});
