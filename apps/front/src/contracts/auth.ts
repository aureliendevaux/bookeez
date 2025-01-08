import { z } from 'zod';

import { c } from '~/contracts/utils';

export const authContract = c.router({
	login: {
		method: 'POST',
		path: '/auth/login',
		responses: {
			200: z.object({
				uid: z.string(),
				username: z.string(),
				roles: z.array(z.enum(['ROLE_USER', 'ROLE_GOD', 'ROLE_LIBRARIAN', 'ROLE_PUBLISHER'])),
			}),
			400: z.object({
				errors: z.array(z.string()),
			}),
		},
		body: z.object({
			email: z.string().email().max(150),
			password: z.string().max(255),
		}),
	},
	check: {
		method: 'GET',
		path: '/auth/check',
		responses: {
			200: z.object({
				uid: z.string(),
				username: z.string(),
				roles: z.array(z.enum(['ROLE_USER', 'ROLE_GOD', 'ROLE_LIBRARIAN', 'ROLE_PUBLISHER'])),
			}),
			401: z.object({
				errors: z.array(z.string()),
			}),
		},
	},
	logout: {
		method: 'POST',
		path: '/auth/logout',
		body: c.type<never>(),
		responses: {
			204: z.object({}),
		},
	},
});
