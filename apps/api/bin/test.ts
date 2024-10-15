/*
|--------------------------------------------------------------------------
| Test runner entrypoint
|--------------------------------------------------------------------------
|
| The "test.ts" file is the entrypoint for running tests using Japa.
|
| Either you can run this file directly or use the "test"
| command to run this file and monitor file changes.
|
*/

process.env.NODE_ENV = 'test';

import 'reflect-metadata';
import { Ignitor, prettyPrintError } from '@adonisjs/core';
import { configure, processCLIArgs, run } from '@japa/runner';

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const AppRoot = new URL('../', import.meta.url);

/**
 * The importer is used to import files in context of the
 * application.
 */
const IMPORTER = (filePath: string) => {
	if (filePath.startsWith('./') || filePath.startsWith('../')) {
		return import(new URL(filePath, AppRoot).href);
	}
	return import(filePath);
};

new Ignitor(AppRoot, { importer: IMPORTER })
	.tap((app) => {
		app.booting(async () => {
			await import('#start/env');
		});
		app.listen('SIGTERM', () => void app.terminate());
		app.listenIf(app.managedByPm2, 'SIGINT', () => void app.terminate());
	})
	.testRunner()
	.configure(async (app) => {
		const { runnerHooks, ...config } = await import('../tests/bootstrap.js');

		processCLIArgs(process.argv.splice(2));
		configure({
			...app.rcFile.tests,
			...config,

			setup: runnerHooks.setup,
			teardown: [...runnerHooks.teardown, () => app.terminate()],
		});
	})
	.run(() => run())
	// eslint-disable-next-line unicorn/prefer-top-level-await
	.catch((error) => {
		process.exitCode = 1;
		void prettyPrintError(error);
	});
