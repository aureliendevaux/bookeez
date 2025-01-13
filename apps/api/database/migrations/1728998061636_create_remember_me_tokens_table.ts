import { Kysely, sql } from 'kysely';

import type { DB } from '#types/db';

import { tableNameGenerator } from '#database/utils';

const { fk, pk, tableName, uq } = tableNameGenerator('remember_me_tokens');

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable(tableName)

		// Columns
		.addColumn('id', 'integer', (col) => col.generatedAlwaysAsIdentity().notNull())
		.addColumn('uid', 'uuid', (col) => col.notNull())
		.addColumn('tokenable_id', 'integer', (col) => col.notNull())
		.addColumn('hash', 'varchar', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))
		.addColumn('expires_at', 'timestamp', (col) => col.notNull().defaultTo(sql`now()`))

		// Constraints
		.addPrimaryKeyConstraint(pk(), ['id'])
		.addUniqueConstraint(uq('uid'), ['uid'])
		.addForeignKeyConstraint(fk('tokenable_id'), ['tokenable_id'], 'users', ['id'], (cb) =>
			cb.onDelete('cascade'),
		)

		// Run
		.execute();
}
