import vine from '@vinejs/vine';

import { SchemaFactory } from '#validators/utils/schema_factory';

export const createBookTypeValidator = SchemaFactory.create(
	vine.object({
		name: vine.string().unique(async (database, value) => {
			const result = await database
				.selectFrom('book_types')
				.select('id')
				.where('name', '=', value)
				.execute();

			return result.length === 0;
		}),
	}),
);

export const updateBookTypeValidator = SchemaFactory.createWithMetadata<{ id: number }>()(
	vine.object({
		name: vine.string().unique(async (database, value, field) => {
			const result = await database
				.selectFrom('book_types')
				.select('id')
				.where('name', '=', value)
				.where('id', '!=', field.meta.id)
				.execute();

			return result.length === 0;
		}),
	}),
);
