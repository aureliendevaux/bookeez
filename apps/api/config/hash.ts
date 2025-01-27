import type { InferHashers } from '@adonisjs/core/types';

import { defineConfig, drivers } from '@adonisjs/core/hash';

const hashConfig = defineConfig({
	default: 'scrypt',

	list: {
		scrypt: drivers.scrypt({
			blockSize: 8,
			cost: 16384,
			maxMemory: 33554432,
			parallelization: 1,
		}),
	},
});

export default hashConfig;

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface HashersList extends InferHashers<typeof hashConfig> {}
}
