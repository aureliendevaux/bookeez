import { Kysely } from 'kysely';

import type { DB } from '#types/db';

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('kinds')
		.addColumn('id', 'integer', (col) => col.primaryKey().generatedAlwaysAsIdentity().notNull())
		.addColumn('uid', 'uuid', (col) => col.unique().notNull())
		.addColumn('name', 'varchar', (col) => col.unique().notNull())
		.addColumn('created_at', 'timestamp', (col) => col.notNull())
		.addColumn('updated_at', 'timestamp', (col) => col.notNull())
		.addColumn('created_by_id', 'integer', (col) =>
			col.references('users.id').onDelete('set null').defaultTo(null),
		)
		.addColumn('updated_by_id', 'integer', (col) =>
			col.references('users.id').onDelete('set null').defaultTo(null),
		)
		.execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('kinds').execute();
}
