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
		resetPasswordToken: null | Uid;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: null | number;
		updatedById: null | number;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace RememberMeToken {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		tokenableId: number;
		hash: string;
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
		createdById: null | number;
		updatedById: null | number;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

	export interface Table {
		createdAt: Timestamp;
		createdById: null | number;
export declare namespace Publisher {
	export interface Table {
		id: Generated<number>;
		uid: Uid;
		name: string;
		website: string | null;
		createdAt: Timestamp;
		updatedAt: Timestamp;
		createdById: null | number;
		updatedById: null | number;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export declare namespace PublisherUser {
	export interface Table {
		userId: number;
		publisherId: number;
		createdAt: Timestamp;
	}

	export type Row = Selectable<Table>;
	export type Create = Insertable<Table>;
	export type Update = Updateable<Table>;
}

export interface DB {
	users: User.Table;
	kinds: Kind.Table;
	remember_me_tokens: RememberMeToken.Table;
	users: User.Table;
	publishers: Publisher.Table;
	publishers_users: PublisherUser.Table;
}
