import { ApplicationService } from '@adonisjs/core/types';

export class DatabaseTestUtils {
	constructor(protected app: ApplicationService) {}

	/**
	 * Testing hook for running migrations
	 * Return a function to roll back the whole database
	 *
	 * Note that this is slower than truncate() because it
	 * has to run all migration in both directions when running tests
	 */
	async migrate() {
		await this.#runCommand('db:migrate');
		return () => this.#runCommand('db:truncate', ['--silent']);
	}

	/**
	 * Testing hook for running seeds
	 */
	async seed() {
		await this.#runCommand('app:defaults');
	}

	/**
	 * Testing hook for running migrations ( if needed )
	 * Return a function to truncate the whole database but keep the schema
	 */
	async truncate() {
		await this.#runCommand('db:truncate', ['--silent']);
	}

	/**
	 * Testing hook to reset database
	 */
	async wipe() {
		await this.#runCommand('db:wipe', ['--force']);
	}

	async #runCommand(commandName: string, args: Array<string> = []) {
		const ace = await this.app.container.make('ace');
		const command = await ace.exec(commandName, args);
		if (!command.exitCode) return;

		throw command.error ?? new Error(`"${commandName}" failed`);
	}
}
