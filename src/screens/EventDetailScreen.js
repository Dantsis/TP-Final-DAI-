import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';
import { getEvent } from '../services/events';

export default function EventDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [item, setItem] = useState(null);

  useEffect(() => {
    (async () => { setItem(await getEvent(id)); })();
  }, [id]);

  if (!item) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator color="#fff" />
  </View>;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700' }}>{item.title}</Text>
      <Text style={{ color: colors.mutted, marginTop: 8 }}>{item.description || 'Sin descripción'}</Text>
      {item.venue?.name ? <Text style={{ color: colors.mutted, marginTop: 8 }}>📍 {item.venue.name}</Text> : null}
      <View style={{ height: spacing.lg }} />
      <PrimaryButton title="Editar" onPress={() => navigation.navigate('FormEvento', { id })} />
    </View>
  );
}
