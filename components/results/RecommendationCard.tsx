import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Recommendation } from '../../types';
import { Card } from '../ui/Card';
import { formatTime } from '../../utils/formatTime';
import { roundVenueTime } from '../../utils/roundVenueTime';
import { getPlaceTypeLabel } from '../../utils/getPlaceTypeLabel';
import { getPhotoUrl } from '../../utils/getPhotoUrl';
import { getPriceLabel } from '../../utils/getPriceLabel';
import { PRICED_PLACE_TYPES } from '../../constants';

interface Props {
  recommendation: Recommendation;
  onPress: () => void;
}

function parseClosingTimeToMinutes(closingTime: string): number {
  const match = closingTime.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return Infinity;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + mins;
}

function getOpenBadge(
  openNow: boolean,
  closingTime: string | null
): { label: string; style: 'closed' | 'warning' } | null {
  if (!openNow) return { label: 'Closed', style: 'closed' };
  if (!closingTime) return null;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const closeMinutes = parseClosingTimeToMinutes(closingTime);
  const minutesUntilClose = closeMinutes - nowMinutes;

  if (minutesUntilClose <= 240) {
    return { label: `Closes at ${closingTime}`, style: 'warning' };
  }
  return null;
}

export function RecommendationCard({ recommendation, onPress }: Props) {
  const badge = getOpenBadge(recommendation.openNow, recommendation.closingTime);
  const typeLabel = getPlaceTypeLabel(recommendation.types);
  const photos = recommendation.photoReferences.slice(0, 2);
  const isPriced = recommendation.types.some((t) => PRICED_PLACE_TYPES.has(t));
  const priceLabel = isPriced ? getPriceLabel(recommendation.priceLevel) : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        {photos.length > 0 && (
          <View style={styles.imageStripWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 8 }}
            >
              {photos.map((ref) => (
                <Image
                  key={ref}
                  source={{ uri: getPhotoUrl(ref, 400) }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{recommendation.name}</Text>
          <Text style={styles.rating}>★ {recommendation.rating.toFixed(1)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            → {formatTime(recommendation.travelTimeSeconds)} away
          </Text>
          <Text style={styles.infoTextMuted}>
            {' '}(round trip: {formatTime(recommendation.travelTimeSeconds * 2)})
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            ~{roundVenueTime(recommendation.timeAtVenueMinutes)} min to spend here
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.bottomLeft}>
            {typeLabel && (
              <View style={styles.typeTag}>
                <Text style={styles.typeTagText}>{typeLabel}</Text>
              </View>
            )}
            {priceLabel && (
              <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>{priceLabel}</Text>
              </View>
            )}
            {badge && (
              <View style={[styles.badge, badge.style === 'closed' ? styles.badgeClosed : styles.badgeWarning]}>
                <Text style={[styles.badgeText, badge.style === 'closed' ? styles.badgeClosedText : styles.badgeWarningText]}>
                  {badge.label}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
  },
  imageStripWrapper: {
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: 12,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  image: {
    width: 150,
    height: 110,
    borderRadius: 8,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  rating: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoTextMuted: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  typeTagText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '500',
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
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgeClosed: {
    backgroundColor: '#FEE2E2',
  },
  badgeClosedText: {
    color: '#991B1B',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeWarningText: {
    color: '#92400E',
  },
  chevron: {
    fontSize: 22,
    color: '#9CA3AF',
    lineHeight: 24,
  },
});
