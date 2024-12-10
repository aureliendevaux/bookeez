import vine from '@vinejs/vine';

import { SchemaFactory } from '#validators/utils/schema_factory';

export const forgotPasswordValidator = SchemaFactory.create(
	vine.object({
		email: vine
			.string()
			.email()
			.exists(async (database, value) => {
				const result = await database
					.selectFrom('users')
					.select('id')
					.where('email', '=', value)
					.executeTakeFirst();

				return result !== undefined;
			}),
	}),
);
