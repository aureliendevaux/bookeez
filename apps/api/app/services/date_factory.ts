import { DateTime } from 'luxon';

class DateCreationError extends Error {
	constructor() {
		super('Invalid date');
	}
}

export function date(requestedDate?: DateTime | Date | string): DateTime<true> {
	if (!requestedDate) {
		return DateTime.now();
	}

	if (requestedDate instanceof DateTime) {
		if (!requestedDate.isValid) {
			throw new DateCreationError();
		}

		return requestedDate;
	}

	if (requestedDate instanceof Date) {
		const dateObject = DateTime.fromJSDate(requestedDate);

		if (!dateObject.isValid) {
			throw new DateCreationError();
		}

		return dateObject;
	}

	const dateObject = DateTime.fromSQL(requestedDate);

	if (!dateObject.isValid) {
		throw new DateCreationError();
	}

	return dateObject;
}
