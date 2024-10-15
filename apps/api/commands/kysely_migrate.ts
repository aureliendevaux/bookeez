import type { CommandOptions } from '@adonisjs/core/types/ace';

import * as fs from 'node:fs/promises';
import path from 'node:path';

import { BaseCommand } from '@adonisjs/core/ace';
import { FileMigrationProvider, Migrator } from 'kysely';

import { db } from '#database/db';

export default class KyselyMigrate extends BaseCommand {
	static readonly commandName = 'kysely:migrate';
	static readonly description = 'Migrate the database by executing pending migrations';
	static readonly options: CommandOptions = {
		startApp: true,
	};

	declare migrator: Migrator;

	/**
	 * Prepare lifecycle hook runs before the "run" method
	 * and hence, we use it to prepare the migrator
	 * instance
	 */
	prepare() {
		this.migrator = new Migrator({
			db,
			provider: new FileMigrationProvider({
				fs,
				path,
				migrationFolder: this.app.migrationsPath(),
			}),
		});
	}

	/**
	 * The complete lifecycle hook runs after the "run" method
	 * and hence, we use it to close the data connection.
	 */
	async completed() {
		await db.destroy();
	}

	/**
	 * Runs migrations up method
	 */
	async run() {
		const { error, results } = await this.migrator.migrateToLatest();

		/**
		 * Print results
		 */
		if (results)
			for (const it of results) {
				switch (it.status) {
					case 'Success': {
						this.logger.success(`migration "${it.migrationName}" was executed successfully`);
						break;
					}
					case 'Error': {
						this.logger.error(`failed to execute migration "${it.migrationName}"`);
						break;
					}
					case 'NotExecuted': {
						this.logger.info(`migration pending "${it.migrationName}"`);
					}
				}
			}

		/**
		 * Display error
		 */
		if (error) {
			this.logger.error('Failed to migrate');
			this.error = error;
			this.exitCode = 1;
		}
	}
}
