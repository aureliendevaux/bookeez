import { Kysely } from 'kysely';

import type { DB } from '#types/db';

import { tableNameGenerator } from '#database/utils';

const { tableName, pk, uq, fk, now } = tableNameGenerator('book_types');

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable(tableName)

		// Columns
		.addColumn('id', 'integer', (col) => col.generatedAlwaysAsIdentity().notNull())
		.addColumn('uid', 'uuid', (col) => col.notNull())
		.addColumn('name', 'varchar', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.notNull().defaultTo(now()))
		.addColumn('updated_at', 'timestamp', (col) => col.notNull().defaultTo(now()))
		.addColumn('created_by_id', 'integer', (col) => col.defaultTo(null))
		.addColumn('updated_by_id', 'integer', (col) => col.defaultTo(null))

		// Constraints
		.addPrimaryKeyConstraint(pk(), ['id'])
		.addUniqueConstraint(uq('uid'), ['uid'])
		.addUniqueConstraint(uq('name'), ['name'])
		.addForeignKeyConstraint(fk('created_by_id'), ['created_by_id'], 'users', ['id'], (cb) =>
			cb.onDelete('set null'),
		)
		.addForeignKeyConstraint(fk('updated_by_id'), ['updated_by_id'], 'users', ['id'], (cb) =>
			cb.onDelete('set null'),
		)

		// Run
		.execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}
