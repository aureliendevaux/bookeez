import vine from '@vinejs/vine';

import { SchemaFactory } from '#validators/utils/schema_factory';

export const createKindValidator = SchemaFactory.create(
	vine.object({
		name: vine.string().unique(async (database, value) => {
			const result = await database
				.selectFrom('kinds')
				.select('id')
				.where('name', '=', value)
				.execute();

			return result.length === 0;
		}),
	}),
);

export const updateKindValidator = SchemaFactory.createWithMetadata<{ id: number }>()(
	vine.object({
		name: vine.string().unique(async (database, value, field) => {
			const result = await database
				.selectFrom('kinds')
				.select('id')
				.where('name', '=', value)
				.where('id', '!=', field.meta.id)
				.execute();

			return result.length === 0;
		}),
	}),
);
