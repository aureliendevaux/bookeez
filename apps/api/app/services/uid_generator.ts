import type { Request, Response } from '@adonisjs/core/http';

import { v7 as uuidV7 } from 'uuid';

// eslint-disable-next-line sonarjs/redundant-type-aliases
export type Uid = string;

export function generateUid() {
	return uuidV7();
}

export const uidRegex = /^[\dA-Za-z]{36}$/;

export function getRequestUidOrFail(request: Request, response: Response) {
	const parameter = request.param('uid', null) as null | Uid;

	if (!parameter) {
		response.abort(400);
	}

	return parameter;
}
