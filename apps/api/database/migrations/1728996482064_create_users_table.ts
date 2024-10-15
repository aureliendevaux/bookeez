import { Kysely, sql } from 'kysely';

import type { DB } from '#types/db';

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('users')
		.addColumn('id', 'integer', (col) => col.primaryKey().generatedAlwaysAsIdentity().notNull())
		.addColumn('uid', 'uuid', (col) => col.unique().notNull())
		.addColumn('email', 'varchar(150)', (col) => col.unique().notNull())
		.addColumn('username', 'varchar(50)', (col) => col.unique().notNull())
		.addColumn('password', 'varchar', (col) => col.notNull())
		.addColumn('roles', sql`varchar[]`, (col) => col.notNull().defaultTo('{}'))
		.addColumn('reset_password_token', 'uuid', (col) => col.defaultTo(null))
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
	await db.schema.dropTable('users').execute();
}
