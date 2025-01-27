import { CamelCasePlugin, Kysely, PostgresDialect, sql } from 'kysely';
import { DateTime } from 'luxon';
import pg from 'pg';

import type { DB } from '#types/db';

import { parseTime } from '#services/date_factory';
import env from '#start/env';

pg.types.setTypeParser(pg.types.builtins.DATE, (value: null | string) => {
	if (value === null) {
		return null;
	}

	const date = DateTime.fromSQL(value);

	if (!date.isValid) {
		throw new Error(`Invalid date: ${value}`);
	}

	return date.set({ hour: 0, millisecond: 0, minute: 0, second: 0 });
});

pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value: null | string) => {
	if (value === null) {
		return null;
	}

	const date = DateTime.fromSQL(value);

	if (!date.isValid) {
		throw new Error(`Invalid timestamp: ${value}`);
	}

	return date;
});

pg.types.setTypeParser(pg.types.builtins.TIME, (value: null | string) => {
	if (value === null) {
		return null;
	}

	return parseTime(value);
});

const dialect = new PostgresDialect({
	pool: new pg.Pool({
		database: env.get('POSTGRES_DB'),
		host: env.get('POSTGRES_HOST'),
		max: 10,
		password: env.get('POSTGRES_PASSWORD'),
		port: env.get('POSTGRES_PORT'),
		user: env.get('POSTGRES_USER'),
	}),
});

export const db = new Kysely<DB>({
	dialect,
	plugins: [new CamelCasePlugin()],
});

export type AppDB = typeof db;

export async function dropAllDomains() {
	const domains = await getAllDomains();
	if (domains.length === 0) return;

	// Don't drop built-in domains
	// https://www.postgresql.org/docs/current/infoschema-datatypes.html
	const builtInDomains = new Set([
		'cardinal_number',
		'character_data',
		'sql_identifier',
		'time_stamp',
		'yes_or_no',
	]);

	const domainsToDrop = domains.filter((domain) => !builtInDomains.has(domain));

	await sql.raw(`DROP DOMAIN "${domainsToDrop.join('", "')}" CASCADE;`).execute(db);
}

export async function dropAllTables() {
	let tables = await getAllTables();

	/**
	 * Filter out tables that are not allowed to be dropped
	 */
	tables = tables.filter((table) => !['spatial_ref_sys'].includes(table));

	if (tables.length === 0) {
		return;
	}

	await sql.raw(`DROP TABLE "${tables.join('", "')}" CASCADE;`).execute(db);
}

export async function dropAllTypes() {
	const types = await getAllTypes();
	if (types.length === 0) return;

	await sql.raw(`DROP TYPE "${types.join('", "')}" CASCADE;`).execute(db);
}

export async function dropAllViews() {
	const views = await getAllViews();
	if (views.length === 0) return;

	await sql.raw(`DROP VIEW "${views.join('", "')}" CASCADE;`).execute(db);
}

export async function getAdvisoryLock(key: string): Promise<boolean> {
	const { rows } = await sql
		.raw<{ lock_status: boolean }>(`SELECT PG_TRY_ADVISORY_LOCK('${key}') as lock_status;`)
		.execute(db);

	return rows[0]?.lock_status === true;
}

export async function getAllDomains() {
	const { rows } = await sql
		.raw<{
			typname: string;
		}>(
			`SELECT DISTINCT pg_type.typname
         FROM pg_type
                INNER JOIN pg_namespace ON pg_namespace.oid = pg_type.typnamespace
         WHERE pg_type.typtype = 'd';`,
		)
		.execute(db);

	return rows.map(({ typname }) => typname);
}

export async function getAllTables() {
	const { rows } = await sql
		.raw<{
			tableName: string;
		}>(
			`SELECT tablename AS table_name
         FROM pg_catalog.pg_tables
         WHERE schemaname IN ('public')
         ORDER BY tablename;`,
		)
		.execute(db);

	return rows.map(({ tableName }) => tableName);
}

export async function getAllTypes() {
	const { rows } = await sql
		.raw<{
			typname: string;
		}>(
			`SELECT DISTINCT pg_type.typname
         FROM pg_type
                INNER JOIN pg_enum ON pg_enum.enumtypid = pg_type.oid;`,
		)
		.execute(db);

	return rows.map(({ typname }) => typname);
}

export async function getAllViews() {
	const { rows } = await sql
		.raw<{
			viewName: string;
		}>(
			`SELECT viewname AS view_name
         FROM pg_catalog.pg_views
         WHERE schemaname IN ('public')
         ORDER BY viewname;`,
		)
		.execute(db);

	return rows.map(({ viewName }) => viewName);
}

export async function releaseAdvisoryLock(key: string): Promise<boolean> {
	const { rows } = await sql
		.raw<{ lock_status: boolean }>(`SELECT PG_ADVISORY_UNLOCK('${key}') as lock_status;`)
		.execute(db);

	return rows[0]?.lock_status === true;
}

export async function truncate(table: string, cascade = false) {
	if (cascade) {
		return await sql`TRUNCATE TABLE ${sql.table(table)} CASCADE;`.execute(db);
	}

	return sql`TRUNCATE TABLE ${sql.table(table)};`.execute(db);
}
