import type { NextFn } from '@adonisjs/core/types/http';

import { HttpContext } from '@adonisjs/core/http';
import { Logger } from '@adonisjs/core/logger';

/**
 * The container bindings middleware binds classes to their request
 * specific value using the container resolver.
 *
 * - We bind "HttpContext" class to the "ctx" object
 * - And bind "Logger" class to the "ctx.logger" object
 */
export default class ContainerBindingsMiddleware {
	handle(ctx: HttpContext, next: NextFn) {
		ctx.containerResolver.bindValue(HttpContext, ctx);
		ctx.containerResolver.bindValue(Logger, ctx.logger);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return next();
	}
}
