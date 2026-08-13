import { create } from 'zustand';
import { TravelMode, Place, Recommendation } from '../types';

interface WanderStore {
  userLocation: { lat: number; lng: number } | null;
  timeBudget: number;
  travelMode: TravelMode;
  categoryFilter: string | null;

  candidates: Place[];
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;

  setUserLocation: (loc: { lat: number; lng: number }) => void;
  setTimeBudget: (minutes: number) => void;
  setTravelMode: (mode: TravelMode) => void;
  setCategoryFilter: (type: string | null) => void;
  setCandidates: (places: Place[]) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaults = {
  userLocation: null,
  timeBudget: 60,
  travelMode: 'walking' as TravelMode,
  categoryFilter: null,
  candidates: [],
  recommendations: [],
  isLoading: false,
  error: null,
};

export const useWanderStore = create<WanderStore>((set) => ({
  ...defaults,

  setUserLocation: (loc) => set({ userLocation: loc }),
  setTimeBudget: (minutes) => set({ timeBudget: minutes }),
  setTravelMode: (mode) => set({ travelMode: mode }),
  setCategoryFilter: (type) => set({ categoryFilter: type }),
  setCandidates: (places) => set({ candidates: places }),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(defaults),
}));
