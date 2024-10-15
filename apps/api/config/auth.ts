import type { InferAuthEvents, Authenticators, InferAuthenticators } from '@adonisjs/auth/types';

import { defineConfig } from '@adonisjs/auth';
import { sessionGuard } from '@adonisjs/auth/session';
import { configProvider } from '@adonisjs/core';

const authConfig = defineConfig({
	default: 'web',
	guards: {
		web: sessionGuard({
			useRememberMeTokens: true,
			rememberMeTokensAge: '2w',
			provider: configProvider.create(async () => {
				const { SessionKyselyUserProvider } = await import(
					'../app/auth_providers/session_user_provider.js'
				);
				return new SessionKyselyUserProvider();
			}),
		}),
	},
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface EventsList extends InferAuthEvents<Authenticators> {}
}
