import { create } from 'zustand';

type SearchScope = 'GLOBAL' | 'PROJECTS' | 'CLIENTS' | 'MATERIALS' | 'SETTINGS' | 'MAPS' | 'SHOP' | 'SERVICES';

interface SearchState {
  isOpen: boolean;
  scope: SearchScope;
  query: string;           // Global search query shared across all screens
  activeFilters: {
    type: 'all' | 'service' | 'provider' | 'product';
    emirate: string;
    rating: number;
    verified: boolean;
  };
  setOpen: (isOpen: boolean) => void;
  setScope: (scope: SearchScope) => void;
  setQuery: (query: string) => void;
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;
  toggle: () => void;
}

const DEFAULT_FILTERS = {
  type: 'all' as const,
  emirate: 'all',
  rating: 0,
  verified: false,
};

export const useSearchStore = create<SearchState>((set) => ({
  isOpen: false,
  scope: 'GLOBAL',
  query: '',
  activeFilters: { ...DEFAULT_FILTERS },
  setOpen: (isOpen) => set({ isOpen }),
  setScope: (scope) => set({ scope }),
  setQuery: (query) => set({ query }),
  setFilter: (key, value) => set((state) => ({
    activeFilters: { ...state.activeFilters, [key]: value }
  })),
  resetFilters: () => set({ activeFilters: { ...DEFAULT_FILTERS }, query: '' }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
