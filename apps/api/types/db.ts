import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

import type { Uid } from '#services/uid_generator';

export type Generated<T> =
	T extends ColumnType<infer S, infer I, infer U>
		? ColumnType<S, I | undefined, U>
		: ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, string, string>;

export declare namespace User {
	export type Create = Insertable<Table>;

	export type Row = Selectable<Table>;
	export interface Table {
		createdAt: Timestamp;
		createdById: null | number;
		email: string;
		id: Generated<number>;
		password: string;
		resetPasswordToken: null | Uid;
		roles: Array<string>;
		uid: Uid;
		updatedAt: Timestamp;
		updatedById: null | number;
		username: string;
	}
	export type Update = Updateable<Table>;
}

export declare namespace RememberMeToken {
	export type Create = Insertable<Table>;

	export type Row = Selectable<Table>;
	export interface Table {
		createdAt: Timestamp;
		expiresAt: Timestamp;
		hash: string;
		id: Generated<number>;
		tokenableId: number;
		uid: Uid;
		updatedAt: Timestamp;
	}
	export type Update = Updateable<Table>;
}

export declare namespace Kind {
	export type Create = Insertable<Table>;

	export type Row = Selectable<Table>;
	export interface Table {
		createdAt: Timestamp;
		createdById: null | number;
		id: Generated<number>;
		name: string;
		uid: Uid;
		updatedAt: Timestamp;
		updatedById: null | number;
	}
	export type Update = Updateable<Table>;
}

export interface DB {
	kinds: Kind.Table;
	remember_me_tokens: RememberMeToken.Table;
	users: User.Table;
}
