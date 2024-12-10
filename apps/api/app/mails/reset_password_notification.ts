import { BaseMail } from '@adonisjs/mail';

export default class ResetPasswordNotification extends BaseMail {
	subject = 'Réinitialisation de mot de passe';

	constructor(
		private readonly email: string,
		private readonly resetLink: string,
	) {
		super();
	}

	prepare() {
		this.message.to(this.email);
		this.message.htmlView('emails/forgot_password', {
			link: this.resetLink,
		});
	}
}
