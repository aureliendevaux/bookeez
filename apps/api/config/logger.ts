import type { InferLoggers } from '@adonisjs/core/types';

import { defineConfig, targets } from '@adonisjs/core/logger';
import app from '@adonisjs/core/services/app';

import env from '#start/env';

const loggerConfig = defineConfig({
	default: 'app',

	/**
	 * The loggers object can be used to define multiple loggers.
	 * By default, we configure only one logger (named "app").
	 */
	loggers: {
		app: {
			enabled: true,
			level: env.get('LOG_LEVEL'),
			name: env.get('APP_NAME'),
			transport: {
				targets: targets()
					.pushIf(!app.inProduction, targets.pretty())
					.pushIf(app.inProduction, targets.file({ destination: 1 }))
					.toArray(),
			},
		},
	},
});

export default loggerConfig;

/**
 * Inferring types for the list of loggers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
