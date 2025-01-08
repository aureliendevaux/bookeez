import { QueryClient } from '@tanstack/react-query';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';

import { contract } from '~/contracts';

export const queryClient = new QueryClient();

export const tsr = initTsrReactQuery(contract, {
	baseUrl: 'https://api.bookeez.aaa',
	baseHeaders: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	credentials: 'include',
	validateResponse: true,
});
