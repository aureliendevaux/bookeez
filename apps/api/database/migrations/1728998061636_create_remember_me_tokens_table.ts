import { Kysely } from 'kysely';

import type { DB } from '#types/db';

export async function up(db: Kysely<DB>): Promise<void> {
	await db.schema
		.createTable('remember_me_tokens')
		.addColumn('id', 'integer', (col) => col.primaryKey().generatedAlwaysAsIdentity().notNull())
		.addColumn('uid', 'uuid', (col) => col.unique().notNull())
		.addColumn('tokenable_id', 'integer', (col) =>
			col.references('users.id').onDelete('cascade').notNull(),
		)
		.addColumn('hash', 'varchar', (col) => col.notNull())
		.addColumn('created_at', 'timestamp', (col) => col.notNull())
		.addColumn('expires_at', 'timestamp', (col) => col.notNull())
		.execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('remember_me_tokens').execute();
}
