import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Platform, Linking, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { listEvents } from '../services/events';

const isValidCoord = (n, min, max) => typeof n === 'number' && isFinite(n) && n >= min && n <= max;

export default function MapScreen({ navigation }) {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const [events, setEvents] = useState([]);


  useEffect(() => {
    (async () => {
      try {

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = loc.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          });
        } else {

          setRegion({
            latitude: -34.6037,
            longitude: -58.3816,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          });
        }


        const rows = await listEvents();
        const withCoords = rows.filter(
          (e) => isValidCoord(e.lat, -90, 90) && isValidCoord(e.lng, -180, 180)
        );
        setEvents(withCoords);


        setTimeout(() => {
          if (mapRef.current && withCoords.length > 0) {
            const coords = withCoords.map((e) => ({ latitude: e.lat, longitude: e.lng }));
            mapRef.current.fitToCoordinates(coords, {
              edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
              animated: true,
            });
          }
        }, 400);
      } catch (e) {
        Alert.alert('Mapa', String(e.message || e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goExternalMaps = (ev) => {
    if (!isValidCoord(ev?.lat, -90, 90) || !isValidCoord(ev?.lng, -180, 180)) return;
    const { lat, lng, title, venue } = ev;
    const label = encodeURIComponent(venue?.name || title || 'Evento');
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Mapa', 'No se pudo abrir la app de mapas.');
    });
  };

  if (!region || loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" />
        <Text style={{ color: colors.mutted, marginTop: 8 }}>Cargando mapa…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
        toolbarEnabled={false}
        customMapStyle={DARK_STYLE}
      >
        {events.map((ev) => (
          <Marker
            key={ev.id}
            coordinate={{ latitude: ev.lat, longitude: ev.lng }}
            title={ev.title || 'Evento'}
            description={ev.venue?.name || 'Sin lugar'}
          >
            <Callout onPress={() => navigation.navigate('DetalleEvento', { id: ev.id })}>
              <View style={{ width: 220 }}>
                <Text style={{ fontWeight: '700', marginBottom: 4 }}>{ev.title || 'Evento'}</Text>
                {!!ev.venue?.name && <Text>📍 {ev.venue.name}</Text>}
                <View style={{ height: 8 }} />
                <TouchableOpacity
                  onPress={() => navigation.navigate('DetalleEvento', { id: ev.id })}
                  style={{
                    paddingVertical: 8,
                    borderRadius: 10,
                    backgroundColor: '#1f2937',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Ver detalle</Text>
                </TouchableOpacity>
                <View style={{ height: 6 }} />
                <TouchableOpacity
                  onPress={() => goExternalMaps(ev)}
                  style={{
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#1f2937',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#93c5fd', fontWeight: '600' }}>Ir con Google/Apple Maps</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}


const DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
];
