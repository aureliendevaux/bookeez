import router from '@adonisjs/core/services/router';

import { middleware } from '#start/kernel';

const LoginController = () => import('#controllers/auth/login_controller');
const CheckController = () => import('#controllers/auth/check_controller');
const LogoutController = () => import('#controllers/auth/logout_controller');
const RegisterController = () => import('#controllers/auth/register_controller');
const ForgotPasswordController = () => import('#controllers/auth/forgot_password_controller');
const ResetPasswordController = () => import('#controllers/auth/reset_password_controller');
const DeleteAccountController = () => import('#controllers/account/delete_account_controller');
const KindsController = () => import('#controllers/kinds_controller');
const PublishersController = () => import('#controllers/publishers_controller');

router
	.group(() => {
		router.post('login', [LoginController]).as('auth.login');
		router.get('check', [CheckController]).as('auth.check');
		router.post('register', [RegisterController]).as('auth.register');
		router.post('logout', [LogoutController]).as('auth.logout').use(middleware.auth());
		router.post('forgot-password', [ForgotPasswordController]).as('auth.password.forgot');
		router.post('reset-password/:token', [ResetPasswordController]).as('auth.password.reset');
	})
	.prefix('auth');

router
	.group(() => {
		router.delete('', [DeleteAccountController]).as('account.delete');
	})
	.prefix('account')
	.middleware(middleware.auth());

router
	.group(() => {
		router.get('/', [KindsController, 'index']).as('kinds.index');
		router.post('/', [KindsController, 'store']).as('kinds.store');
		router.put('/:uid', [KindsController, 'update']).as('kinds.update');
		router.delete('/:uid', [KindsController, 'destroy']).as('kinds.destroy');
	})
	.prefix('kinds')
	.middleware(middleware.auth());

router
	.group(() => {
		router.get('/', [PublishersController, 'index']).as('publishers.index');
		router.post('/', [PublishersController, 'store']).as('publishers.store');
		router.put('/:uid', [PublishersController, 'update']).as('publishers.update');
		router.delete('/:uid', [PublishersController, 'destroy']).as('publishers.destroy');
	})
	.prefix('publishers')
	.middleware(middleware.auth());
