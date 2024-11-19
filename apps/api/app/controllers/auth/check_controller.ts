import { HttpContext } from '@adonisjs/core/http';

export default class CheckController {
	handle({ auth, response }: HttpContext) {
		if (!auth.user) {
			return response.unauthorized();
		}

		return response.json({
			uid: auth.user.uid,
			roles: auth.user.roles,
			username: auth.user.username,
		});
	}
}
