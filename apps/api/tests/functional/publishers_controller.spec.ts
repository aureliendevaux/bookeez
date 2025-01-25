import app from '@adonisjs/core/services/app';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import PublisherRepository from '#repositories/publisher_repository';
import PublisherUserRepository from '#repositories/publisher_user_repository';
import UserRepository from '#repositories/user_repository';

// eslint-disable-next-line @typescript-eslint/naming-convention
const TEST_USERS = {
  ADMIN: {
    email: 'admin@lepublisher.com',
    roles: ['ROLE_ADMIN'],
    username: 'admin'
  },
  PUBLISHER: {
    email: 'publisher@lepublisher.com',
    roles: ['ROLE_USER'],
    username: 'publisher'
  },
  NON_ADMIN: {
    email: 'user@lepublisher.com',
    roles: ['ROLE_USER', 'ROLE_PUBLISHER'],
    username: 'nonadmin'
  },
  OTHER: {
    email: 'other@lepublisher.com',
    roles: ['ROLE_USER', 'ROLE_PUBLISHER'],
    username: 'other'
  },
  REGULAR_USER: {
    email: 'regular@lepublisher.com',
    roles: ['ROLE_USER'],
    username: 'regular'
  }
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const TEST_PUBLISHER = {
  name: 'LePublisher',
  website: 'https://LePublisher.com'
};

const createTestUser = async (userRepository: UserRepository, data: {
  email: string;
  roles: Array<string>;
  username: string;
}) => {
  return userRepository.create({
    ...data,
    password: 'password'
  }).returningAllOrThrow();
};

test.group('Publishers API', (group) => {
  group.each.setup(() => testUtils.db().truncate());

  test('GET /publishers - authentication rules', async ({ assert, client }) => {
    const userRepository = await app.container.make(UserRepository);
    const publisherRepository = await app.container.make(PublisherRepository);

    const user = await createTestUser(userRepository, TEST_USERS.REGULAR_USER);

    const expectedCount = await publisherRepository.count('id');

    // Authenticated request should succeed
    const authedResponse = await client.get('/publishers').loginAs(user);
    authedResponse.assertStatus(200);
    assert.lengthOf(authedResponse.response.body as Array<unknown>, expectedCount);

    // Unauthenticated request should fail
    const unauthedResponse = await client.get('/publishers');
    unauthedResponse.assertStatus(401);
  });

  test('POST /publishers - admin-only creation', async ({ assert, client }) => {
    const userRepository = await app.container.make(UserRepository);
    const publisherRepository = await app.container.make(PublisherRepository);

    const [admin, nonAdmin, publisher] = await Promise.all([
      createTestUser(userRepository, TEST_USERS.ADMIN),
      createTestUser(userRepository, TEST_USERS.NON_ADMIN),
      createTestUser(userRepository, TEST_USERS.PUBLISHER)
    ]);

    const publisherCount = await publisherRepository.count('id');

    // Admin can create publisher
    const adminResponse = await client
      .post('/publishers')
      .json({ ...TEST_PUBLISHER, publisherUserUid: publisher.uid })
      .loginAs(admin);

    adminResponse.assertStatus(201);
    adminResponse.assertBodyContains(TEST_PUBLISHER);

    const updatedPublisher = await userRepository
      .findOneByOrFail([['uid', '=', publisher.uid]])
      .selectAll();
    assert.include(updatedPublisher?.roles, 'ROLE_PUBLISHER');

    // Non-admin cannot create publisher
    const nonAdminResponse = await client
      .post('/publishers')
      .json({ ...TEST_PUBLISHER, publisherUserUid: publisher.uid })
      .loginAs(nonAdmin);

    nonAdminResponse.assertStatus(403);
    assert.equal(await publisherRepository.count('id'), publisherCount + 1);
  });

  test('PUT /publishers/:uid - update permissions', async ({ client }) => {
    const [userRepository, publisherRepository, publisherUserRepository] = await Promise.all([
      app.container.make(UserRepository),
      app.container.make(PublisherRepository),
      app.container.make(PublisherUserRepository)
    ]);

    // Setup test users
    const [admin, associatedPublisher, otherUser] = await Promise.all([
      createTestUser(userRepository, TEST_USERS.ADMIN),
      createTestUser(userRepository, TEST_USERS.PUBLISHER),
      createTestUser(userRepository, TEST_USERS.OTHER)
    ]);

    // Create publisher and associate
    const publisher = await publisherRepository
      .create(TEST_PUBLISHER)
      .returningAllOrThrow();

    await publisherUserRepository
      .create({
        publisherId: publisher.id,
        userId: associatedPublisher.id
      })
      .returningAllOrThrow();

    // Test update permissions
    const updates = [
      { user: admin, name: 'Updated by Admin', expectedStatus: 200 },
      { user: associatedPublisher, name: 'Updated by Publisher', expectedStatus: 200 },
      { user: otherUser, name: 'Updated by Other', expectedStatus: 403 }
    ];

    for (const update of updates) {
      const response = await client
        .put(`/publishers/${publisher.uid}`)
        .json({ name: update.name })
        .loginAs(update.user);

      response.assertStatus(update.expectedStatus);
      if (update.expectedStatus === 200) {
        response.assertBodyContains({ name: update.name });
      }
    }
  });

  test('DELETE /publishers/:uid - deletion permissions', async ({ assert, client }) => {
    const repositories = {
      user: await app.container.make(UserRepository),
      publisher: await app.container.make(PublisherRepository),
      publisherUser: await app.container.make(PublisherUserRepository)
    };

    const users = await Promise.all([
      createTestUser(repositories.user, TEST_USERS.ADMIN),
      createTestUser(repositories.user, TEST_USERS.PUBLISHER),
      createTestUser(repositories.user, TEST_USERS.OTHER)
    ]);

    const createPublisher = async () => {
      const publisher = await repositories.publisher
        .create(TEST_PUBLISHER)
        .returningAllOrThrow();

      await repositories.publisherUser
        .create({
          publisherId: publisher.id,
          userId: users[1].id
        })
        .returningAllOrThrow();

      return publisher;
    };

    // Test deletion scenarios
    const scenarios = [
      { user: users[0], expectedStatus: 204 }, // Admin
      { user: users[1], expectedStatus: 204 }, // Associated publisher
      { user: users[2], expectedStatus: 403 }  // Other user
    ];

    for (const scenario of scenarios) {
      const publisher = await createPublisher();
      const beforeCount = await repositories.publisher.count('id');

      const response = await client
        .delete(`/publishers/${publisher.uid}`)
        .loginAs(scenario.user);

      response.assertStatus(scenario.expectedStatus);

      const afterCount = await repositories.publisher.count('id');
      assert.equal(
        afterCount,
        scenario.expectedStatus === 204 ? beforeCount - 1 : beforeCount
      );
    }
  });
});
