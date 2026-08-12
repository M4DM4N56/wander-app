import { useEffect } from 'react';
import { useWanderStore } from '../store/wanderStore';
import { fetchNearbyPlaces } from '../services/placesService';
import { fetchTravelTimes } from '../services/distanceService';
import { rankPlaces } from '../utils/ranking';
import { radiusFromBudget } from '../utils/radiusFromBudget';

export function useRecommendations() {
  const userLocation = useWanderStore((s) => s.userLocation);
  const timeBudget = useWanderStore((s) => s.timeBudget);
  const travelMode = useWanderStore((s) => s.travelMode);
  const categoryFilter = useWanderStore((s) => s.categoryFilter);
  const setLoading = useWanderStore((s) => s.setLoading);
  const setError = useWanderStore((s) => s.setError);
  const setCandidates = useWanderStore((s) => s.setCandidates);
  const setRecommendations = useWanderStore((s) => s.setRecommendations);

  useEffect(() => {
    (async () => {
      if (userLocation === null) {
        setError('No location available');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { lat, lng } = userLocation;
        const radius = radiusFromBudget(timeBudget, travelMode);

        const candidates = await fetchNearbyPlaces(lat, lng, radius, categoryFilter);

        const distanceResults = await fetchTravelTimes(
          lat,
          lng,
          candidates.map((p) => ({ placeId: p.placeId, lat: p.lat, lng: p.lng })),
          travelMode
        );

        const ranked = rankPlaces(candidates, distanceResults, timeBudget);

        setRecommendations(ranked);
        setCandidates(candidates);
        setLoading(false);
      } catch {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    })();
  }, []);
}
