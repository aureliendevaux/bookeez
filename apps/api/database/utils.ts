import { sql } from 'kysely';

function now() {
	return sql`now()`;
}

export function tableNameGenerator(tableName: string) {
	function key(name: string) {
		return `${tableName}_${name}`;
	}

	function pk() {
		return key('pk');
	}

	function uq(name: string) {
		return key(`${name}_uq`);
	}

	function fk(name: string) {
		return key(`${name}_fk`);
	}

	return {
		fk,
		key,
		pk,
		tableName,
		uq,
		now,
	};
}
