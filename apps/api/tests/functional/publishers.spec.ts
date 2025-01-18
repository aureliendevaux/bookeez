import PublisherRepository from '#repositories/publisher_repository';
import UserRepository from '#repositories/user_repository';
import app from '@adonisjs/core/services/app';

import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';


test.group('Publishers', (group) => {
    group.each.setup(() => testUtils.db().truncate());

    test('it should list all publishers in database', async ({ assert, client }) => {
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

    test('it should create a new publisher', async ({ assert, client }) => {
        // 1. Given
        const userRepository = await app.container.make(UserRepository);
        const publisherRepository = await app.container.make(PublisherRepository);
        const admin = await userRepository
            .create({
                email: 'admin@email.test',
                password: 'password',
                roles: ['ROLE_ADMIN'],
                username: 'admin',
            })
            .returningAllOrThrow();
        const user = await userRepository
            .create({
                email: 'user@email.test',
                password: 'password',
                roles: ['ROLE_USER'],
                username: 'user',
            })
            .returningAllOrThrow();
        const beforeCount = await publisherRepository.count('id');
    
        // 2. Act
        const response = await client
            .post('/publishers')
            .json({
                name: 'New Publisher',
                website: 'https://newpublisher.com',
                publisherUserUid: user.uid,
            })
            .loginAs(admin);
    
        // 3. Assert
        const afterCount = await publisherRepository.count('id');
        response.assertStatus(201);
        response.assertBodyContains({
            name: 'New Publisher',
        });
        assert.equal(afterCount, beforeCount + 1);
        const updatedUser = await userRepository.findOneBy([['id', '=', user.id]]).selectAll();
        assert.include(updatedUser?.roles, 'ROLE_PUBLISHER');
    });

    test('it should update a publisher by its uid', async ({ assert, client }) => {
        // 1. Given
        const userRepository = await app.container.make(UserRepository);
        const publisherRepository = await app.container.make(PublisherRepository);
        const admin = await userRepository
            .create({
                email: 'admin@email.test',
                password: 'password',
                roles: ['ROLE_ADMIN'],
                username: 'admin',
            })
            .returningAllOrThrow();
        const publisher = await publisherRepository
            .create({ name: 'Old Publisher' })
            .returningOrThrow('uid');
        const beforeCount = await publisherRepository.count('id');

        // 2. Act
        const response = await client
            .put(`/publishers/${publisher.uid}`)
            .json({
                name: 'Updated Publisher',
            })
            .loginAs(admin);

        // 3. Assert
        const afterCount = await publisherRepository.count('id');
        response.assertStatus(200);
        response.assertBodyContains({
            name: 'Updated Publisher',
        });
        assert.equal(afterCount, beforeCount);
    });

    test('it should delete a publisher by its uid', async ({ assert, client }) => {
        // 1. Given
        const userRepository = await app.container.make(UserRepository);
        const publisherRepository = await app.container.make(PublisherRepository);
        const admin = await userRepository
            .create({
                email: 'admin@email.test',
                password: 'password',
                roles: ['ROLE_ADMIN'],
                username: 'admin',
            })
            .returningAllOrThrow();
        const publisher = await publisherRepository
            .create({ name: 'Publisher to Delete' })
            .returningOrThrow('uid');
        const beforeCount = await publisherRepository.count('id');

        // 2. Act
        const response = await client.delete(`/publishers/${publisher.uid}`).loginAs(admin);

        // 3. Assert
        const afterCount = await publisherRepository.count('id');
        response.assertStatus(204);
        assert.equal(afterCount, beforeCount - 1);
    });
    
});