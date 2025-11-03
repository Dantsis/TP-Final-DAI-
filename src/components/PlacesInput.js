import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import colors from '../theme/colors';

const KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export default function PlacesInput({
  placeholder = 'Buscar dirección…',
  country = 'ar',          
  onPlacePicked,           
  style,
  inputStyle,
  listStyle,
}) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const abortRef = useRef(null);

  const trimmed = q.trim();
  const canSearch = useMemo(() => KEY && trimmed.length >= 2, [trimmed]);

  useEffect(() => {
    if (!canSearch) { setResults([]); return; }

    
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          input: trimmed,
          key: KEY,
          language: 'es',
          ...(country ? { components: `country:${country}` } : {})
        });
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();

        if (json.status !== 'OK') {
         
          setResults([]);
          return;
        }
        setResults(Array.isArray(json.predictions) ? json.predictions : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, country]);

  const pick = async (pred) => {
    try {
      setLoading(true);
      
      const p2 = new URLSearchParams({
        place_id: pred.place_id,
        key: KEY,
        language: 'es',
        fields: 'name,formatted_address,geometry'
      });
      const url = `https://maps.googleapis.com/maps/api/place/details/json?${p2.toString()}`;
      const r = await fetch(url);
      const j = await r.json();
      const det = j.result || {};
      const loc = det?.geometry?.location;
      onPlacePicked?.({
        name: det?.name || pred?.structured_formatting?.main_text || pred.description,
        address: det?.formatted_address || pred.description,
        lat: loc?.lat ?? null,
        lng: loc?.lng ?? null,
        placeId: pred.place_id
      });
      setQ(det?.formatted_address || pred.description || '');
      setResults([]);
    } catch {
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[{ width: '100%' }, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        value={q}
        onChangeText={setQ}
        autoCorrect={false}
        style={[
          {
            backgroundColor: '#111827',
            color: '#fff',
            borderRadius: 8,
            paddingHorizontal: 12,
            height: 44,
          },
          inputStyle
        ]}
      />
      {loading ? (
        <View style={{ paddingVertical: 8 }}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : null}
      {results.length > 0 && (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={results}
          keyExtractor={(it) => it.place_id}
          style={[{ backgroundColor: '#0b1220', borderRadius: 8, marginTop: 6, maxHeight: 220 }, listStyle]}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => pick(item)}
              style={{ paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#1f2937' }}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>
                {item.structured_formatting?.main_text || item.description}
              </Text>
              <Text style={{ color: colors.mutted }} numberOfLines={1}>
                {item.structured_formatting?.secondary_text || ''}
              </Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View style={{ height: 6 }} />}
        />
      )}
      {!KEY && (
        <Text style={{ color: '#fca5a5', marginTop: 6 }}>
          ⚠️ Falta EXPO_PUBLIC_GOOGLE_PLACES_API_KEY
        </Text>
      )}
    </View>
  );
}
