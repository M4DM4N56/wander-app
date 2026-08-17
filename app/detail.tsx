import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
import { Button } from '../components/ui/Button';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailScreen() {
  const router = useRouter();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const recommendations = useWanderStore((s) => s.recommendations);
  const rec = recommendations.find((r) => r.placeId === placeId);
  const [activePhoto, setActivePhoto] = useState(0);
  const carouselRef = useRef<ScrollView>(null);

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

  const handleNavigate = () => {
    const url =
      Platform.OS === 'android'
        ? `geo:${rec.lat},${rec.lng}?q=${rec.lat},${rec.lng}(${encodeURIComponent(rec.name)})`
        : `maps:0,0?q=${encodeURIComponent(rec.name)}@${rec.lat},${rec.lng}`;
    Linking.openURL(url);
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActivePhoto(index);
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
          <View style={styles.carouselWrapper}>
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              style={styles.carousel}
            >
              {rec.photoReferences.map((ref, index) => (
                <Image
                  key={index}
                  source={{ uri: getPhotoUrl(ref, 800) }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View style={styles.dots}>
              {rec.photoReferences.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === activePhoto ? styles.dotActive : styles.dotInactive]}
                />
              ))}
            </View>
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              ★ {rec.rating.toFixed(1)}{' '}
              <Text style={styles.reviewCount}>({rec.totalRatings} reviews)</Text>
            </Text>
          </View>

          {!rec.openNow && (
            <View style={styles.infoRow}>
              <View style={[styles.badge, styles.badgeClosed]}>
                <Text style={styles.badgeClosedText}>Closed</Text>
              </View>
            </View>
          )}

          {rec.types.some((t) => PRICED_PLACE_TYPES.has(t)) && getPriceLabel(rec.priceLevel) && (
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                Price range: {getPriceLabel(rec.priceLevel)} per person
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              → {formatTime(rec.travelTimeSeconds)} to get there
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              ~{roundVenueTime(rec.timeAtVenueMinutes)} min to spend here
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              Round trip: {formatTime(rec.travelTimeSeconds * 2)}
            </Text>
          </View>
        </View>

        <Button label="Take me there →" onPress={handleNavigate} />
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
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  carouselWrapper: {
    marginBottom: 20,
  },
  carousel: {
    width: SCREEN_WIDTH,
    height: 220,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 220,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  dotActive: {
    backgroundColor: '#4F46E5',
  },
  dotInactive: {
    backgroundColor: '#D1D5DB',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    marginHorizontal: 16,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 15,
    color: '#374151',
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
