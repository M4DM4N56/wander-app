import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TravelMode } from '../../types';

const MODES: { label: string; value: TravelMode }[] = [
  { label: 'Walking', value: 'walking' },
  { label: 'Cycling', value: 'cycling' },
  { label: 'Driving', value: 'driving' },
  { label: 'Transit', value: 'transit' },
];

interface TravelModeSelectorProps {
  value: TravelMode;
  onChange: (mode: TravelMode) => void;
}

export function TravelModeSelector({ value, onChange }: TravelModeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How are you getting around?</Text>
      <View style={styles.row}>
        {MODES.map((mode) => {
          const selected = mode.value === value;
          return (
            <TouchableOpacity
              key={mode.value}
              style={[styles.option, selected ? styles.optionSelected : styles.optionUnselected]}
              onPress={() => onChange(mode.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, selected ? styles.optionTextSelected : styles.optionTextUnselected]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  option: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#4F46E5',
  },
  optionUnselected: {
    backgroundColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  optionTextUnselected: {
    color: '#111827',
  },
});
