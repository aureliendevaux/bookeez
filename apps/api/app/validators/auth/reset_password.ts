import vine from '@vinejs/vine';

import { SchemaFactory } from '#validators/utils/schema_factory';

export const resetPasswordValidator = SchemaFactory.create(
	vine.object({
		password: vine.string().isSafePassword(),
	}),
);
