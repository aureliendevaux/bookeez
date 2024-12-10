import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

interface TAuthUser {
	uid: string;
	username: string;
	roles: Array<string>;
}

interface TAuthState {
	user: TAuthUser | null;
}

interface TAuthActions {
	login: (user: TAuthUser) => void;
	logout: () => void;
	isAuthenticated: () => boolean;
	getUser: () => TAuthUser | null;
}

const useAuthStore = create<TAuthState & TAuthActions>((set, get) => ({
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

export function useAuthActions() {
	return useAuthStore(
		useShallow((state) => ({
			login: state.login,
			logout: state.logout,
			isAuthenticated: state.isAuthenticated,
			getUser: state.getUser,
		})),
	);
}
