import vine from '@vinejs/vine';

import { SchemaFactory } from '#validators/utils/schema_factory';

export const registerValidator = SchemaFactory.create(
	vine.object({
		email: vine
			.string()
			.email()
			.unique(async (database, value) => {
				const result = await database
					.selectFrom('users')
					.select('id')
					.where('email', '=', value)
					.execute();

				return result.length === 0;
			}),
		password: vine.string().confirmed().isSafePassword(),
		username: vine.string().unique(async (database, value) => {
			const result = await database
				.selectFrom('users')
				.select('id')
				.where('username', '=', value)
				.execute();

			return result.length === 0;
		}),
	}),
	{
		'email.email': "Merci d'utiliser un email valide",
		'password.confirmed': 'Les deux mots de passe ne correspondent pas',
	},
);
