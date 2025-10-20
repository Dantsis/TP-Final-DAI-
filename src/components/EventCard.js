import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function EventCard({ item, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#1f2937'
      }}>
        {item.posterUrl ? (
          <Image source={{ uri: item.posterUrl }} style={{ height: 160, borderRadius: 10, marginBottom: spacing.sm }} />
        ) : null}
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{item.title}</Text>
        <Text style={{ color: colors.mutted, marginTop: 4 }} numberOfLines={2}>
          {item.description || 'Sin descripción'}
        </Text>
        {item.venue?.name ? (
          <Text style={{ color: colors.mutted, marginTop: 6 }}>📍 {item.venue.name}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
