import vine from '@vinejs/vine';

import { SchemaFactory } from '#validators/utils/schema_factory';

export const loginValidator = SchemaFactory.create(
	vine.object({
		email: vine.string().email(),
		password: vine.string(),
	}),
);
