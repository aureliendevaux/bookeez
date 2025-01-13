import vine, { VineNumber, VineString } from '@vinejs/vine';
import { isNumber, isString } from 'radash';

import { db } from '#services/db';

export const uniqueRule = vine.createRule<
	Parameters<VineNumber['unique'] | VineString['unique']>[0]
>(async (value, checker, field) => {
	if (!field.isValid) {
		return;
	}

	if (!value) return;
	if (!isNumber(value) && !isString(value)) return;

	const isUnique = await checker(db, value as never, field);
	if (!isUnique) {
		field.report('The {{ field }} has already been taken', 'database.unique', field);
	}
});

export const existsRule = vine.createRule<
	Parameters<VineNumber['exists'] | VineString['exists']>[0]
>(async (value, checker, field) => {
	if (!field.isValid) {
		return;
	}

	if (!value) return;
	if (!isNumber(value) && !isString(value)) return;

	const exists = await checker(db, value as never, field);
	if (!exists) {
		field.report('The selected {{ field }} is invalid', 'database.exists', field);
	}
});

/**
 * Defines the "unique" and "exists" validation rules with
 * VineJS.
 */
export function defineValidationRules() {
	VineString.macro('unique', function (this: VineString, checker) {
		return this.use(uniqueRule(checker));
	});

	VineString.macro('exists', function (this: VineString, checker) {
		return this.use(existsRule(checker));
	});

	VineNumber.macro('unique', function (this: VineNumber, checker) {
		return this.use(uniqueRule(checker));
	});

	VineNumber.macro('exists', function (this: VineNumber, checker) {
		return this.use(existsRule(checker));
	});
}
