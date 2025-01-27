import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

import { Bouncer } from '@adonisjs/bouncer';

import { policies } from '#policies/main';

export default class InitializeBouncerMiddleware {
	// eslint-disable-next-line @typescript-eslint/require-await
	async handle(ctx: HttpContext, next: NextFn) {
		ctx.bouncer = new Bouncer(
			() => ctx.auth.user ?? null,
			undefined,
			policies,
		).setContainerResolver(ctx.containerResolver);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return next();
	}
}

declare module '@adonisjs/core/http' {
	export interface HttpContext {
		bouncer: Bouncer<Exclude<HttpContext['auth']['user'], undefined>, undefined, typeof policies>;
	}
}
