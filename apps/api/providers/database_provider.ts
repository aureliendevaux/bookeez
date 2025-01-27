import type { ApplicationService } from '@adonisjs/core/types';
import type { FieldContext } from '@vinejs/vine/types';

import { db } from '#services/db';
import { DatabaseTestUtils } from '#tests/utils/database';

declare module '@adonisjs/core/test_utils' {
	export interface TestUtils {
		db(): DatabaseTestUtils;
	}
}

/**
 * Extending VineJS schema types
 */
declare module '@vinejs/vine' {
	interface VineKyselyBindings<ValueType extends number | string> {
		/**
		 * Ensure the value exists inside the database by self
		 * executing a query.
		 *
		 * - The callback must return "false", if the value exists.
		 * - The callback must return "true", if the value does not exist.
		 */
		exists(
			callback: (database: typeof db, value: ValueType, field: FieldContext) => Promise<boolean>,
		): this;

		/**
		 * Ensure the value is unique inside the database by self
		 * executing a query.
		 *
		 * - The callback must return "true", if the value is unique (does not exist).
		 * - The callback must return "false", if the value is not unique (already exists).
		 */
		unique(
			callback: (database: typeof db, value: ValueType, field: FieldContext) => Promise<boolean>,
		): this;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface VineNumber extends VineKyselyBindings<number> {}

	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface VineString extends VineKyselyBindings<string> {}
}

/**
 * Database service provider
 */
export default class DatabaseServiceProvider {
	constructor(protected app: ApplicationService) {}

	/**
	 * Invoked by AdonisJS to extend the framework or pre-configure
	 * objects
	 */
	async boot() {
		this.registerTestUtils();
		await this.registerVineJSRules();
	}

	/**
	 * Gracefully close connections during shutdown
	 */
	async shutdown() {
		await db.destroy();
	}

	/**
	 * Register TestUtils database macro
	 */
	protected registerTestUtils() {
		this.app.container.resolving('testUtils', async () => {
			const { TestUtils } = await import('@adonisjs/core/test_utils');

			TestUtils.macro('db', () => {
				return new DatabaseTestUtils(this.app);
			});
		});
	}

	/**
	 * Registers validation rules for VineJS
	 */
	protected async registerVineJSRules() {
		if (this.app.usingVineJS) {
			const { defineValidationRules } = await import('#validators/utils/database_bindings');
			defineValidationRules();
		}
	}
}
