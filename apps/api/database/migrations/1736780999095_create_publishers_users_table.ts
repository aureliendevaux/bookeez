import { Kysely } from 'kysely';

import type { DB } from '#types/db';

import { tableNameGenerator } from '#database/utils';

const { tableName, pk, fk, now } = tableNameGenerator('publishers_users');

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable(tableName)

		// Columns
		.addColumn('user_id', 'integer', (col) => col.notNull())
		.addColumn('publisher_id', 'integer', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(now()))

		// Constraints
		.addPrimaryKeyConstraint(pk(), ['user_id', 'publisher_id'])
		.addForeignKeyConstraint(fk('users'), ['user_id'], 'users', ['id'], (cb) =>
			cb.onDelete('cascade'),
		)
		.addForeignKeyConstraint(fk('publishers'), ['publisher_id'], 'publishers', ['id'], (cb) =>
			cb.onDelete('cascade'),
		)

		// Run
		.execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}
