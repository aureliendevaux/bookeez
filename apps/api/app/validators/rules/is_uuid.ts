import vine from '@vinejs/vine';
import { FieldContext } from '@vinejs/vine/types';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

export interface Options {
	version?: number;
}

export const isUuid = vine.createRule(
	(value: unknown, options: Options | undefined, field: FieldContext) => {
		if (!field.isValid) return;

		if (!value || typeof value !== 'string') return;

		const validated = uuidValidate(value) && uuidVersion(value) === (options?.version ?? 7);

		if (!validated) {
			field.report(
				'{{field}} must be a valid UUID' + (options?.version ? ` version ${options.version}` : ''),
				'is_uuid',
				field,
			);
		}
	},
	{ implicit: false, isAsync: false },
);
