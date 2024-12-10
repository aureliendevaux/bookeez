import { create } from 'zustand';

interface TAuthUser {
	uid: string;
	username: string;
	roles: Array<string>;
}

interface TAuthStore {
	user: TAuthUser | null;
	login: (user: TAuthUser) => void;
	logout: () => void;
	isAuthenticated: () => boolean;
	getUser: () => TAuthUser | null;
}

export const useAuthStore = create<TAuthStore>((set, get) => ({
	user: null,
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
}));
