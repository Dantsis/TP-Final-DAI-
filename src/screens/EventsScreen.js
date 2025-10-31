import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import EventCard from '../components/EventCard';
import PrimaryButton from '../components/PrimaryButton';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { listEvents } from '../services/events';

export default function EventsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listEvents();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.md }}>
      <PrimaryButton title="Nuevo evento" onPress={() => navigation.navigate('FormEvento')} />
      <View style={{ height: spacing.md }} />
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={it => it.id}
          renderItem={({ item }) => (
            <EventCard item={item} onPress={() => navigation.navigate('DetalleEvento', { id: item.id })} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
          ListEmptyComponent={<Text style={{ color: colors.mutted }}>No hay eventos aún.</Text>}
        />
      )}
    </View>
  );
}
