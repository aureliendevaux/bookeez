import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

const LoginController = () => import('#controllers/auth/login_controller');
const CheckController = () => import('#controllers/auth/check_controller');
const LogoutController = () => import('#controllers/auth/logout_controller');
const RegisterController = () => import('#controllers/auth/register_controller');

router
	.group(() => {
		router.post('login', [LoginController]).as('auth.login');
		router.get('check', [CheckController]).as('auth.check');
		router.post('register', [RegisterController]).as('auth.register');
		router.post('logout', [LogoutController]).as('auth.logout').use(middleware.auth());
	})
	.prefix('auth');
