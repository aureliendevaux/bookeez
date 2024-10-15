import router from '@adonisjs/core/services/router';

const LoginController = () => import('#controllers/auth/login_controller');

router.get('/', () => {
	return {
		hello: 'world',
	};
});

router.post('/auth/login', [LoginController]).as('auth.login');
