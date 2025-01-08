import { Env } from '@adonisjs/core/env';

export default await Env.create(new URL('../', import.meta.url), {
	// Application
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
	PORT: Env.schema.number(),
	APP_KEY: Env.schema.string(),
	HOST: Env.schema.string({ format: 'host' }),
	LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

	// Database
	POSTGRES_HOST: Env.schema.string(),
	POSTGRES_PORT: Env.schema.number(),
	POSTGRES_USER: Env.schema.string(),
	POSTGRES_PASSWORD: Env.schema.string(),
	POSTGRES_DB: Env.schema.string(),

	// Session
	SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

	// Authentication
	GOD_EMAIL: Env.schema.string({ format: 'email' }),
	GOD_PASSWORD: Env.schema.string(),
	GOD_USERNAME: Env.schema.string(),

	// Mailer
	SMTP_HOST: Env.schema.string(),
	SMTP_PORT: Env.schema.string(),

	// Frontend
	FRONTEND_HOST: Env.schema.string({ format: 'url' }),
});
