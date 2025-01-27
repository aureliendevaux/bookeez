import vine from '@vinejs/vine';

import { SchemaFactory } from '#validators/utils/schema_factory';

export const createPublisherValidator = SchemaFactory.create(
	vine.object({
		name: vine.string().unique(async (database, value) => {
			const result = await database
				.selectFrom('publishers')
				.select('id')
				.where('name', 'ilike', value)
				.execute();

			return result.length === 0;
		}),
		website: vine.string().url().optional(),
		publisherUserUid: vine
			.string()
			.isUuid()
			.exists(async (database, value) => {
				const result = await database
					.selectFrom('users')
					.select('id')
					.where('uid', '=', value)
					.executeTakeFirst();

				return result !== undefined;
			}),
	}),
);

export const updatePublisherValidator = SchemaFactory.createWithMetadata<{ id: number }>()(
	vine.object({
		name: vine.string().unique(async (database, value, field) => {
			const result = await database
				.selectFrom('publishers')
				.select('id')
				.where('name', 'ilike', value)
				.where('id', '!=', field.meta.id)
				.execute();

			return result.length === 0;
		}),
		website: vine.string().url().optional(),
	}),
);
