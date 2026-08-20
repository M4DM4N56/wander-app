import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWanderStore } from '../store/wanderStore';
import { useRecommendations } from '../hooks/useRecommendations';
import { RecommendationCard } from '../components/results/RecommendationCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';

export default function ResultsScreen() {
  const router = useRouter();
  useRecommendations();

  const isLoading = useWanderStore((s) => s.isLoading);
  const error = useWanderStore((s) => s.error);
  const recommendations = useWanderStore((s) => s.recommendations);
  const timeBudget = useWanderStore((s) => s.timeBudget);
  const reset = useWanderStore((s) => s.reset);

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <View style={styles.stateContainer}>
          <LoadingSpinner message="Finding places near you..." />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button label="Try again" onPress={() => { reset(); router.replace('/'); }} />
        </View>
      );
    }

    if (recommendations.length === 0) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.emptyText}>
            No places found. Try increasing your time budget or changing your travel mode.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.placeId}
        scrollEnabled={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        renderItem={({ item }) => (
          <RecommendationCard
            recommendation={item}
            onPress={() => router.push(`/detail?placeId=${item.placeId}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>What's nearby</Text>
          <Text style={styles.subtitle}>
            Places you can visit in {timeBudget} minutes
          </Text>
        </View>

        {renderMainContent()}
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
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  stateContainer: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 12,
  },
});
