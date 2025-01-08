import { create } from 'zustand';

import { tsr } from '~/lib/query';

interface TAuthUser {
	uid: string;
	username: string;
	roles: Array<string>;
}

interface TAuthState {
	user: TAuthUser | null;
	actions: {
		login: (user: TAuthUser) => void;
		logout: () => void;
		isAuthenticated: () => boolean;
		getUser: () => TAuthUser | null;
	};
}

const authStore = create<TAuthState>((set, get) => ({
	user: null,
	actions: {
		login(user) {
			set({ user });
		},
		logout() {
			set({ user: null });
		},
		isAuthenticated() {
			return get().user !== null;
		},
		getUser() {
			return get().user;
		},
	},
}));

export function useAuthActions() {
	return authStore((state) => state.actions);
}

export function useAuthState() {
	return authStore((state) => state.user);
}

export function isAuthenticated() {
	return authStore.getState().actions.isAuthenticated();
}

export async function hydrateAuthState() {
	const data = await tsr.auth.check.query();
	if (data.status === 200) {
		authStore.getState().actions.login(data.body);
	}
}
