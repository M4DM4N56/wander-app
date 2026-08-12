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
      <Text style={styles.value}>{value} minutes</Text>
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
      <Text style={styles.label}>How much time do you have?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
});
