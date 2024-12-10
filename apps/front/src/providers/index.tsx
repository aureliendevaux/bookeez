import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '~/lib/query.ts';

export function AppProviders({ children }: PropsWithChildren) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
