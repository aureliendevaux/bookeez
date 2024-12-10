import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, tsr } from '~/lib/query';
import { router } from '~/lib/router';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
