import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from '@tanstack/react-router';

import { queryClient, tsr } from '~/lib/query';
import { router } from '~/lib/router';

export function AppProviders() {
	return (
		<QueryClientProvider client={queryClient}>
			<tsr.ReactQueryProvider>
				<RouterProvider router={router} />
				<ReactQueryDevtools initialIsOpen={false} />
			</tsr.ReactQueryProvider>
		</QueryClientProvider>
	);
}
