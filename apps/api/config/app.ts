import { Secret } from '@adonisjs/core/helpers';
import { defineConfig } from '@adonisjs/core/http';
import app from '@adonisjs/core/services/app';

import env from '#start/env';

/**
 * The app key is used for encrypting cookies, generating signed URLs,
 * and by the "encryption" module.
 *
 * The encryption module will fail to decrypt data if the key is lost or
 * changed. Therefore it is recommended to keep the app key secure.
 */
export const appKey = new Secret(env.get('APP_KEY'));

/**
 * The configuration settings used by the HTTP server
 */
export const http = defineConfig({
	allowMethodSpoofing: false,
	/**
	 * Manage cookies configuration. The settings for the session id cookie are
	 * defined inside the "config/session.ts" file.
	 */
	cookie: {
		domain: 'bookeez.aaa',
		httpOnly: true,
		maxAge: '2h',
		path: '/',
		sameSite: 'lax',
		secure: app.inProduction,
	},

	generateRequestId: true,

	/**
	 * Enabling async local storage will let you access HTTP context
	 * from anywhere inside your application.
	 */
	useAsyncLocalStorage: false,
});
