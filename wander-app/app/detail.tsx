import React from 'react';
import {
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
import MapView, { Marker } from 'react-native-maps';
import { useWanderStore } from '../store/wanderStore';
import { formatTime } from '../utils/formatTime';
import { Button } from '../components/ui/Button';

export default function DetailScreen() {
  const router = useRouter();
  const { placeId } = useLocalSearchParams<{ placeId: string }>();
  const recommendations = useWanderStore((s) => s.recommendations);
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

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: rec.lat,
            longitude: rec.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{ latitude: rec.lat, longitude: rec.lng }}
            title={rec.name}
            pinColor="#4F46E5"
          />
        </MapView>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              ★ {rec.rating.toFixed(1)}{' '}
              <Text style={styles.reviewCount}>({rec.totalRatings} reviews)</Text>
            </Text>
          </View>

          <View style={styles.infoRow}>
            {rec.openNow ? (
              <View style={[styles.badge, styles.badgeOpen]}>
                <Text style={styles.badgeOpenText}>Open now</Text>
              </View>
            ) : (
              <View style={[styles.badge, styles.badgeClosed]}>
                <Text style={styles.badgeClosedText}>Closed</Text>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              🚶 {formatTime(rec.travelTimeSeconds)} to get there
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              ⏱ About {rec.timeAtVenueMinutes} minutes to spend here
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              🔄 Round trip: {formatTime(rec.travelTimeSeconds * 2)}
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
    padding: 16,
    paddingBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
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
  },
  map: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  badgeOpen: {
    backgroundColor: '#D1FAE5',
  },
  badgeOpenText: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '500',
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
