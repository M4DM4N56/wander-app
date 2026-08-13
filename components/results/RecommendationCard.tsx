import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Recommendation } from '../../types';
import { Card } from '../ui/Card';
import { formatTime } from '../../utils/formatTime';

interface Props {
  recommendation: Recommendation;
  onPress: () => void;
  rank: number;
}

export function RecommendationCard({ recommendation, onPress, rank }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.rank}>#{rank}</Text>
          <Text style={styles.rating}>★ {recommendation.rating.toFixed(1)}</Text>
        </View>

        <Text style={styles.name}>{recommendation.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            🚶 {formatTime(recommendation.travelTimeSeconds)} away
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            ⏱ ~{recommendation.timeAtVenueMinutes} min to spend here
          </Text>
        </View>

        <View style={styles.bottomRow}>
          {recommendation.openNow ? (
            <View style={[styles.badge, styles.badgeOpen]}>
              <Text style={styles.badgeOpenText}>Open now</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.badgeClosed]}>
              <Text style={styles.badgeClosedText}>Closed</Text>
            </View>
          )}
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  rating: {
    fontSize: 14,
    color: '#6B7280',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  infoRow: {
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOpen: {
    backgroundColor: '#D1FAE5',
  },
  badgeOpenText: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '500',
  },
  badgeClosed: {
    backgroundColor: '#FEE2E2',
  },
  badgeClosedText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 22,
    color: '#9CA3AF',
    lineHeight: 24,
  },
});
