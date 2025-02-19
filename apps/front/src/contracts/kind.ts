import { c } from '~/contracts/utils';
import { z } from 'zod';

export const kindContract = c.router({
	index: {
		method: 'GET',
		path: '/kinds',
		responses: {
			200: z.array(
				z.object({
					uid: z.string(),
					name: z.string(),
				}),
			),
			401: z.object({
				errors: z.array(z.string()),
			}),
		},
	},
	show: {
		method: 'GET',
		path: '/kinds/:uid',
		pathParams: z.object({
			uid: z.string().uuid(),
		}),
		responses: {
			200: z.object({
				uid: z.string(),
				name: z.string(),
			}),
			401: z.object({
				errors: z.array(z.string()),
			}),
			404: z.object({
				errors: z.array(z.string()),
			}),
		},
	},
	store: {
		method: 'POST',
		path: '/kinds',
		responses: {
			201: z.object({
				uid: z.string(),
				name: z.string(),
			}),
			401: z.object({
				errors: z.array(z.string()),
			}),
			422: z.object({
				errors: z.array(z.string()),
			}),
			404: z.object({
				errors: z.array(z.string()),
			}),
		},
		body: z.object({}),
	},
	update: {
		method: 'PUT',
		path: '/kinds/:uid',
		pathParams: z.object({
			uid: z.string().uuid(),
		}),
		responses: {
			200: z.object({
				uid: z.string(),
				name: z.string(),
			}),
			401: z.object({
				errors: z.array(z.string()),
			}),
			422: z.object({
				errors: z.array(z.string()),
			}),
			404: z.object({
				errors: z.array(z.string()),
			}),
		},
		body: z.object({}),
	},
	destroy: {
		method: 'DELETE',
		path: '/kinds/:uid',
		pathParams: z.object({
			uid: z.string().uuid(),
		}),
		body: c.type<never>(),
		responses: {
			204: z.object({}),
			401: z.object({
				errors: z.array(z.string()),
			}),
			404: z.object({
				errors: z.array(z.string()),
			}),
		},
	},
});
