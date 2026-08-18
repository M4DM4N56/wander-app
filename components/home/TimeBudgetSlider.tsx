import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TimeBudgetSliderProps {
  value: number;
  onChange: (minutes: number) => void;
}

export function TimeBudgetSlider({ value, onChange }: TimeBudgetSliderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How much time do you have?</Text>
      <View style={styles.row}>
        <Text style={styles.value} numberOfLines={1}>{value} min</Text>
        <Slider
          style={styles.slider}
          minimumValue={15}
          maximumValue={180}
          step={5}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor="#4F46E5"
          maximumTrackTintColor="#D1D5DB"
          thumbTintColor="#4F46E5"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    width: 70,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  slider: {
    flex: 1,
    height: 40,
  },
});
