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
		username: vine.string().unique(async (database, value) => {
			const result = await database
				.selectFrom('users')
				.select('id')
				.where('username', '=', value)
				.execute();

			return result.length === 0;
		}),
		password: vine.string().confirmed().isSafePassword(),
	}),
	{
		'email.email': "Merci d'utiliser un email valide",
		// eslint-disable-next-line sonarjs/no-hardcoded-credentials
		'password.confirmed': 'Les deux mots de passe ne correspondent pas',
	},
);
