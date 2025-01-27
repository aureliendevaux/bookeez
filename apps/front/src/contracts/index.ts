import { authContract } from '~/contracts/auth';
import { c } from '~/contracts/utils';

export const contract = c.router({
	auth: authContract,
});
