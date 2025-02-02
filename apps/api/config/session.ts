import app from '@adonisjs/core/services/app';
import { defineConfig, stores } from '@adonisjs/session';

import env from '#start/env';

const sessionConfig = defineConfig({
	/**
	 * Define how long to keep the session data alive without
	 * any activity.
	 */
	age: '2h',
	/**
	 * When set to true, the session id cookie will be deleted
	 * once the user closes the browser.
	 */
	clearWithBrowser: false,

	/**
	 * Configuration for session cookie and the
	 * cookie store
	 */
	cookie: {
		domain: 'bookeez.aaa',
		httpOnly: true,
		path: '/',
		sameSite: 'lax',
		secure: app.inProduction,
	},

	cookieName: 'adonis-session',

	enabled: true,

	/**
	 * The store to use. Make sure to validate the environment
	 * variable in order to infer the store name without any
	 * errors.
	 */
	store: env.get('SESSION_DRIVER'),

	/**
	 * List of configured stores. Refer documentation to see
	 * list of available stores and their config.
	 */
	stores: {
		cookie: stores.cookie(),
	},
});

export default sessionConfig;
