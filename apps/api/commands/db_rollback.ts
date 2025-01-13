import type { CommandOptions } from '@adonisjs/core/types/ace';

import { BaseCommand } from '@adonisjs/core/ace';
import { FileMigrationProvider, Migrator } from 'kysely';
import fs from 'node:fs/promises';
import path from 'node:path';

import { db } from '#services/db';

export default class KyselyRollback extends BaseCommand {
	static readonly commandName = 'db:rollback';
	static readonly description =
		'Rollback the database by running down method on the migration files';
	static readonly options: CommandOptions = {
		startApp: true,
	};

	declare migrator: Migrator;

	/**
	 * The complete lifecycle hook runs after the "run" method
	 * and hence, we use it to close the data connection.
	 */
	async completed() {
		if (this.isMain) {
			await db.destroy();
		}
	}

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
				migrationFolder: this.app.migrationsPath(),
				path,
			}),
		});
	}

	/**
	 * Runs migrations up method
	 */
	async run() {
		const { error, results } = await this.migrator.migrateDown();

		/**
		 * Print results
		 */
		if (results)
			for (const it of results) {
				switch (it.status) {
					case 'Error': {
						this.logger.error(`failed to rollback migration "${it.migrationName}"`);
						break;
					}
					case 'Success': {
						this.logger.success(`migration "${it.migrationName}" rolled back successfully`);
						break;
					}
					case 'NotExecuted': {
						this.logger.info(`rollback pending "${it.migrationName}"`);
					}
				}
			}

		/**
		 * Display error
		 */
		if (error) {
			this.logger.error('Failed to rollback');
			this.error = error;
			this.exitCode = 1;
		}
	}
}
