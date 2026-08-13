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

        {recommendations.map((rec) => (
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
    width: '100%',
    height: 300,
  },
  map: {
    width: '100%',
    height: 300,
  },
});
