import type { CommandOptions } from '@adonisjs/core/types/ace';

import { BaseCommand, flags } from '@adonisjs/core/ace';

import { db, getAllTables, truncate } from '#services/db';

export default class DatabaseSeed extends BaseCommand {
	static readonly commandName = 'db:truncate';
	static readonly description = 'Reset all database tables';
	static readonly options: CommandOptions = {
		startApp: true,
	};

	@flags.boolean({ description: 'Silent output' })
	declare silent: boolean;

	override async completed() {
		if (this.isMain) {
			await db.destroy();
		}
	}

	override async run() {
		let tables = await getAllTables();
		tables = tables.filter((table) => !['spatial_ref_sys'].includes(table));

		for (const tableName of tables) {
			await truncate(tableName, true);
		}

		if (!this.silent) {
			this.logger.success('All tables truncated successfully');
		}
	}
}
