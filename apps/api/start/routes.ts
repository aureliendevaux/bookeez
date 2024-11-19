import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

const LoginController = () => import('#controllers/auth/login_controller');
const CheckController = () => import('#controllers/auth/check_controller');
const LogoutController = () => import('#controllers/auth/logout_controller');
const RegisterController = () => import('#controllers/auth/register_controller');
const ForgotPasswordController = () => import('#controllers/auth/forgot_password_controller');

const DeleteAccountController = () => import('#controllers/account/delete_account_controller');

router
	.group(() => {
		router.post('login', [LoginController]).as('auth.login');
		router.get('check', [CheckController]).as('auth.check');
		router.post('register', [RegisterController]).as('auth.register');
		router.post('logout', [LogoutController]).as('auth.logout').use(middleware.auth());
		router.post('forgot-password', [ForgotPasswordController]).as('auth.password.forgot');
		router
			.post('reset-password/:token', () => {
				console.log('ici');
			})
			.as('auth.password.reset');
	})
	.prefix('auth');

router
	.group(() => {
		router.delete('', [DeleteAccountController]).as('account.delete');
	})
	.prefix('account')
	.middleware(middleware.auth());
