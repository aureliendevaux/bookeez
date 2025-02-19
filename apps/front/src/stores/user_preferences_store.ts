import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

interface TPreferencesStore {
	sidebarOpen: boolean;
	theme: 'light' | 'dark' | 'halloween' | 'christmas';
}

interface TPreferencesState {
	preferences: TPreferencesStore;
	actions: {
		toggleSidebar: () => void;
		setTheme: (theme: TPreferencesStore['theme']) => void;
	};
}

const userPreferencesStore = create<TPreferencesState>()(
	persist(
		(set, get) => ({
			preferences: {
				sidebarOpen: true,
				theme: 'light',
			},
			actions: {
				toggleSidebar() {
					console.log(get().preferences.sidebarOpen);
					set({
						preferences: {
							...get().preferences,
							sidebarOpen: !get().preferences.sidebarOpen,
						},
					});
				},
				setTheme(theme) {
					set({
						preferences: {
							sidebarOpen: get().preferences.sidebarOpen,
							theme,
						},
					});
				},
			},
		}),
		{
			name: 'user_preferences',
			storage: createJSONStorage(() => globalThis.localStorage),
			partialize: (state) => ({ preferences: state.preferences }),
		},
	),
);

export function useSidebarState() {
	return userPreferencesStore(
		useShallow((state) => [state.preferences.sidebarOpen, state.actions.toggleSidebar] as const),
	);
}
