import type { Config } from '@japa/runner/types';

import { authApiClient } from '@adonisjs/auth/plugins/api_client';
import app from '@adonisjs/core/services/app';
import testUtils from '@adonisjs/core/services/test_utils';
import { sessionApiClient } from '@adonisjs/session/plugins/api_client';
import { apiClient } from '@japa/api-client';
import { assert } from '@japa/assert';
import { pluginAdonisJS } from '@japa/plugin-adonisjs';

export const plugins: Config['plugins'] = [
	assert(),
	apiClient(),
	pluginAdonisJS(app),
	sessionApiClient(app),
	authApiClient(app),
];

export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
	setup: [() => testUtils.db().wipe(), () => testUtils.db().migrate()],
	teardown: [],
};

export const configureSuite: Config['configureSuite'] = (suite) => {
	if (['browser', 'e2e', 'functional'].includes(suite.name)) {
		return suite.setup(() => testUtils.httpServer().start());
	}
};

export const reporters: Config['reporters'] = {
	activated: ['spec'],
};
