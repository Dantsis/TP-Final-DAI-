import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useLocation from '../hooks/useLocation';
import colors from '../theme/colors';
import { regionFrom } from '../services/maps';

export default function MapScreen() {
  const { coords, error } = useLocation(true);

  const region = useMemo(() => {
    if (!coords) return null;
    return regionFrom(coords.latitude, coords.longitude, 0.02);
  }, [coords]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {region ? (
        <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation>
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title="Estás aquí" />
        </MapView>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: colors.mutted }}>{error || 'Obteniendo ubicación...'}</Text>
        </View>
      )}
    </View>
  );
}
