import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TimeBudgetSlider } from '../components/home/TimeBudgetSlider';
import { TravelModeSelector } from '../components/home/TravelModeSelector';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { PLACE_CATEGORIES } from '../constants';
import { useLocation } from '../hooks/useLocation';
import { useWanderStore } from '../store/wanderStore';
import { TravelMode } from '../types';

export default function HomeScreen() {
  const router = useRouter();
  const { location, isLoading, error } = useLocation();

  const setUserLocation = useWanderStore((s) => s.setUserLocation);
  const timeBudget = useWanderStore((s) => s.timeBudget);
  const travelMode = useWanderStore((s) => s.travelMode);
  const categoryFilter = useWanderStore((s) => s.categoryFilter);
  const setTimeBudget = useWanderStore((s) => s.setTimeBudget);
  const setTravelMode = useWanderStore((s) => s.setTravelMode);
  const setCategoryFilter = useWanderStore((s) => s.setCategoryFilter);

  useEffect(() => {
    if (location) {
      setUserLocation(location);
    }
  }, [location]);

  useEffect(() => {
    (async () => {
      try {
        const savedMode = await AsyncStorage.getItem('@wander/travelMode');
        const savedBudget = await AsyncStorage.getItem('@wander/lastTimeBudget');

        if (savedMode) setTravelMode(savedMode as TravelMode);
        if (savedBudget) setTimeBudget(parseInt(savedBudget, 10));
      } catch (e) {
        // Nothing saved yet, use defaults
      }
    })();
  }, []);

  const handleFindSomething = async () => {
    await Promise.all([
      AsyncStorage.setItem('@wander/travelMode', travelMode),
      AsyncStorage.setItem('@wander/lastTimeBudget', String(timeBudget)),
    ]);
    router.push('/results');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root}>
        <LoadingSpinner message="Finding your location..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryHint}>Check your location settings and restart the app.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Wander</Text>
        <Text style={styles.subtitle}>You have time to kill. Let's find something.</Text>

        {location && (
          <View style={styles.locationRow}>
            <Text style={styles.locationText}>
              📍 {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <TimeBudgetSlider value={timeBudget} onChange={setTimeBudget} />
        </View>

        <View style={styles.section}>
          <TravelModeSelector value={travelMode} onChange={setTravelMode} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What are you looking for?</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {PLACE_CATEGORIES.map((cat) => {
              const selected = categoryFilter === cat.value;
              return (
                <TouchableOpacity
                  key={String(cat.value)}
                  style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
                  onPress={() => setCategoryFilter(cat.value)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.cta}>
          <Button label="Find something →" onPress={handleFindSomething} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryHint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  locationRow: {
    marginBottom: 24,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 10,
  },
  chipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#4F46E5',
  },
  chipUnselected: {
    backgroundColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipTextUnselected: {
    color: '#374151',
  },
  cta: {
    marginTop: 8,
  },
});
