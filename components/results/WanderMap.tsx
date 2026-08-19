import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Recommendation } from '../../types';
import { formatTime } from '../../utils/formatTime';

interface Props {
  userLocation: { lat: number; lng: number };
  recommendations: Recommendation[];
  onPinPress: (placeId: string) => void;
}

export function WanderMap({ userLocation, recommendations, onPinPress }: Props) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }}
          title="You are here"
          pinColor="#4F46E5"
        />

        {recommendations.length > 0 && recommendations.map((rec) => (
          <Marker
            key={rec.placeId}
            coordinate={{ latitude: rec.lat, longitude: rec.lng }}
            title={rec.name}
            description={`${formatTime(rec.travelTimeSeconds)} away`}
            pinColor="#F59E0B"
            onPress={() => onPinPress(rec.placeId)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: 300,
  },
});
