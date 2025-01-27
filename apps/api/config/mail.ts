import { defineConfig, transports } from '@adonisjs/mail';
import { InferMailers } from '@adonisjs/mail/types';

import env from '#start/env';

const mailConfig = defineConfig({
	default: 'smtp',
	from: 'bookeez<noreply@bookeez.aaa>',
	mailers: {
		smtp: transports.smtp({
			host: env.get('SMTP_HOST'),
			port: env.get('SMTP_PORT'),
		}),
	},
	replyTo: 'contact@bookeez.aaa',
});

export default mailConfig;

declare module '@adonisjs/mail/types' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface MailersList extends InferMailers<typeof mailConfig> {}
}
