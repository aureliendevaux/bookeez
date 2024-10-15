import type { HttpContext } from '@adonisjs/core/http';

import { loginValidator } from '#validators/login';

export default class LoginController {
	async handle({ request, response }: HttpContext) {
		const payload = await request.validateUsing(loginValidator);

		return response.json(payload);
	}
}
