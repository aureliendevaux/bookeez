import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '~/lib/query';
import { router } from '~/lib/router';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function AppProviders() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
