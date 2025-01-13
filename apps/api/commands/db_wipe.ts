import { BaseCommand, flags } from '@adonisjs/core/ace';
import { CommandOptions } from '@adonisjs/core/types/ace';

import { db, dropAllDomains, dropAllTables, dropAllTypes, dropAllViews } from '#services/db';

export default class DatabaseWipe extends BaseCommand {
	static readonly commandName = 'db:wipe';
	static readonly description = 'Drop all tables, views and types in database';
	static readonly options: CommandOptions = {
		startApp: true,
	};

	/**
	 * Drop all domains in database
	 */
	@flags.boolean({ description: 'Drop all domains (Postgres only)' })
	declare dropDomains: boolean;

	/**
	 * Drop all types in database
	 */
	@flags.boolean({ description: 'Drop all custom types (Postgres only)' })
	declare dropTypes: boolean;

	/**
	 * Drop all views in database
	 */
	@flags.boolean({ description: 'Drop all views' })
	declare dropViews: boolean;

	/**
	 * Force command execution in production
	 */
	@flags.boolean({ description: 'Explicitly force command to run in production' })
	declare force: boolean;

	override async completed() {
		if (this.isMain) {
			await db.destroy();
		}
	}

	override async run(): Promise<void> {
		await (this.isMain ? this.runAsMain() : this.runAsSubCommand());
	}

	/**
	 * Drop all domains (if asked for and supported)
	 */
	private async performDropDomains() {
		if (!this.dropDomains) {
			return;
		}

		await dropAllDomains();
		this.logger.success('Dropped domains successfully');
	}

	/**
	 * Drop all tables
	 */
	private async performDropTables() {
		await dropAllTables();
		this.logger.success('Dropped tables successfully');
	}

	/**
	 * Drop all types (if asked for and supported)
	 */
	private async performDropTypes() {
		if (!this.dropTypes) {
			return;
		}

		await dropAllTypes();
		this.logger.success('Dropped types successfully');
	}

	/**
	 * Drop all views (if asked for and supported)
	 */
	private async performDropViews() {
		if (!this.dropViews) {
			return;
		}

		await dropAllViews();
		this.logger.success('Dropped views successfully');
	}

	/**
	 * Branching out, so that if required we can implement
	 * "runAsMain" separately from "runAsSubCommand".
	 *
	 * For now, they both are the same
	 */
	private async runAsMain() {
		await this.runAsSubCommand();
	}

	/**
	 * Run as a subcommand. Never close database connections or exit
	 * process inside this method
	 */
	private async runAsSubCommand() {
		/**
		 * Continue with clearing the database when not in production
		 * or force flag is passed
		 */
		let continueWipe = !this.app.inProduction || this.force;
		if (!continueWipe) {
			continueWipe = await this.takeProductionConsent();
		}

		/**
		 * Do not continue when in prod and the prompt was cancelled
		 */
		if (!continueWipe) {
			return;
		}

		await this.performDropViews();
		await this.performDropTables();
		await this.performDropTypes();
		await this.performDropDomains();
	}

	/**
	 * Prompts to take consent when wiping the database in production
	 */
	private async takeProductionConsent(): Promise<boolean> {
		const question = 'You are in production environment. Want to continue wiping the database?';
		try {
			return await this.prompt.confirm(question);
		} catch {
			return false;
		}
	}
}
