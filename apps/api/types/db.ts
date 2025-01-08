import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

import type { Uid } from '#services/uid_generator';

export type Generated<T> =
	T extends ColumnType<infer S, infer I, infer U>
		? ColumnType<S, I | undefined, U>
		: ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, string, string>;

export declare namespace User {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		email: string;
		username: string;
		password: string;
		roles: Array<string>;
		resetPasswordToken: Uid | null;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace RememberMeToken {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		hash: string;
		tokenableId: number;
		expiresAt: Timestamp;
		createdAt: Timestamp;
		updatedAt: Timestamp;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace Kind {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		name: string;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: number | null;
		updatedById: number | null;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export interface DB {
	users: User.Table;
	remember_me_tokens: RememberMeToken.Table;
	kinds: Kind.Table;
}
