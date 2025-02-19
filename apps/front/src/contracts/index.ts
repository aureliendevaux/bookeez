import { authContract } from '~/contracts/auth';
import { kindContract } from '~/contracts/kind';
import { c } from '~/contracts/utils';

export const contract = c.router({
	auth: authContract,
	admin: {
		kinds: kindContract,
	},
});
