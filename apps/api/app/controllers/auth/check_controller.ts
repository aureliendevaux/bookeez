import { HttpContext } from '@adonisjs/core/http';

export default class CheckController {
	handle({ auth, response }: HttpContext) {
		if (!auth.user) {
			return response.unauthorized();
		}

		return response.json({
			roles: auth.user.roles,
			uid: auth.user.uid,
			username: auth.user.username,
		});
	}
}
