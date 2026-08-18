import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWanderStore } from '../store/wanderStore';
import { formatTime } from '../utils/formatTime';
import { roundVenueTime } from '../utils/roundVenueTime';
import { getPhotoUrl } from '../utils/getPhotoUrl';
import { getPriceLabel } from '../utils/getPriceLabel';
import { PRICED_PLACE_TYPES } from '../constants';
import { TravelMode } from '../types';
import { Button } from '../components/ui/Button';

const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  walking: 'walk',
  cycling: 'ride',
  driving: 'drive',
  transit: 'commute',
};

export default function DetailScreen() {
  const router = useRouter();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const recommendations = useWanderStore((s) => s.recommendations);
  const travelMode = useWanderStore((s) => s.travelMode);
  const rec = recommendations.find((r) => r.placeId === placeId);

  if (!rec) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.errorContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>Place not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const modeLabel = TRAVEL_MODE_LABELS[travelMode];

  const handleNavigate = () => {
    const url =
      Platform.OS === 'android'
        ? `geo:${rec.lat},${rec.lng}?q=${rec.lat},${rec.lng}(${encodeURIComponent(rec.name)})`
        : `maps:0,0?q=${encodeURIComponent(rec.name)}@${rec.lat},${rec.lng}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.name}>{rec.name}</Text>

        {rec.photoReferences.length > 0 && (
          <View style={styles.photoWrapper}>
            <Image
              source={{ uri: getPhotoUrl(rec.photoReferences[0], 800) }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.ratingRow}>
            <Text style={styles.infoText}>
              ★ {rec.rating.toFixed(1)}{' '}
              <Text style={styles.reviewCount}>({rec.totalRatings} reviews)</Text>
            </Text>
            {rec.types.some((t) => PRICED_PLACE_TYPES.has(t)) && getPriceLabel(rec.priceLevel) && (
              <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>{getPriceLabel(rec.priceLevel)}</Text>
              </View>
            )}
          </View>

          {!rec.openNow && (
            <View style={styles.infoRow}>
              <View style={[styles.badge, styles.badgeClosed]}>
                <Text style={styles.badgeClosedText}>Closed</Text>
              </View>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text>
              <Text style={styles.travelPrimary}>
                {formatTime(rec.travelTimeSeconds)} {modeLabel}
              </Text>
              <Text style={styles.travelSecondary}>
                {' '}({formatTime(rec.travelTimeSeconds * 2)} round trip)
              </Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              ~{roundVenueTime(rec.timeAtVenueMinutes)} min to spend here
            </Text>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button label="Take me there →" onPress={handleNavigate} />
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
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '500',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 0,
    paddingHorizontal: 16,
  },
  photoWrapper: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: 220,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  priceTagText: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#374151',
  },
  travelPrimary: {
    fontSize: 15,
    color: '#374151',
  },
  travelSecondary: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  reviewCount: {
    color: '#6B7280',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeClosed: {
    backgroundColor: '#FEE2E2',
  },
  badgeClosedText: {
    fontSize: 13,
    color: '#991B1B',
    fontWeight: '500',
  },
  buttonWrapper: {
    marginHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
});
