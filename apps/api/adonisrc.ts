import { defineConfig } from '@adonisjs/core/app';

export default defineConfig({
	commands: [
		() => import('@adonisjs/core/commands'),
		() => import('@adonisjs/mail/commands'),
		() => import('@adonisjs/bouncer/commands'),
	],
	metaFiles: [
		{
			pattern: 'resources/views/**/*.edge',
			reloadServer: false,
		},
	],
	preloads: [() => import('#start/routes'), () => import('#start/kernel')],
	providers: [
		() => import('@adonisjs/core/providers/app_provider'),
		() => import('@adonisjs/core/providers/hash_provider'),
		{
			environment: ['repl', 'test'],
			file: () => import('@adonisjs/core/providers/repl_provider'),
		},
		() => import('@adonisjs/core/providers/vinejs_provider'),
		() => import('@adonisjs/cors/cors_provider'),
		() => import('@adonisjs/session/session_provider'),
		() => import('@adonisjs/auth/auth_provider'),
		() => import('#providers/database_provider'),
		() => import('#providers/validator_provider'),
		() => import('@adonisjs/mail/mail_provider'),
		() => import('@adonisjs/core/providers/edge_provider'),
		() => import('@adonisjs/bouncer/bouncer_provider'),
	],
	tests: {
		forceExit: false,
		suites: [
			{
				files: ['tests/unit/**/*.spec(.ts|.js)'],
				name: 'unit',
				timeout: 2000,
			},
			{
				files: ['tests/functional/**/*.spec(.ts|.js)'],
				name: 'functional',
				timeout: 30000,
			},
		],
	},
});
