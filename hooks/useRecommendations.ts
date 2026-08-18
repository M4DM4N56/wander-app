import { useEffect } from 'react';
import { useWanderStore } from '../store/wanderStore';
import { fetchNearbyPlaces } from '../services/placesService';
import { fetchTravelTimes } from '../services/distanceService';
import { rankPlaces } from '../utils/ranking';
import { radiusFromBudget } from '../utils/radiusFromBudget';
import { API_BASE_URL } from '../constants';
import { Place } from '../types';

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
    console.log('useRecommendations effect — userLocation:', userLocation, '| API_BASE_URL:', API_BASE_URL);

    if (userLocation === null) {
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const { lat, lng } = userLocation;
        const radius = radiusFromBudget(timeBudget, travelMode);

        let candidates: Place[] = [];
        try {
          candidates = await fetchNearbyPlaces(lat, lng, radius, categoryFilter);
        } catch (err) {
          console.warn('fetchNearbyPlaces failed, continuing with empty candidates:', err);
        }

        if (candidates.length === 0) {
          setRecommendations([]);
          setCandidates([]);
          setLoading(false);
          return;
        }

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
  }, [userLocation]);
}
