import type { ApplicationService } from '@adonisjs/core/types';

import { VineString } from '@vinejs/vine';

import type { Options as IsUuidOptions } from '#validators/rules/is_uuid';

declare module '@vinejs/vine' {
	interface VineString {
		isCurrentPassword(): this;
		isSafePassword(): this;
		isUuid(options?: IsUuidOptions): this;
	}
}

export default class ValidatorServiceProvider {
	constructor(protected app: ApplicationService) {}

	async boot() {
		if (this.app.usingVineJS) {
			const { isCurrentPassword } = await import('#validators/rules/is_current_password');
			const { isSafePassword } = await import('#validators/rules/is_safe_password');
			const { isUuid } = await import('#validators/rules/is_uuid');

			VineString.macro('isCurrentPassword', function (this: VineString) {
				return this.use(isCurrentPassword());
			});

			VineString.macro('isSafePassword', function (this: VineString) {
				return this.use(isSafePassword());
			});

			VineString.macro('isUuid', function (this: VineString, options: IsUuidOptions) {
				return this.use(isUuid(options));
			});
		}
	}
}
