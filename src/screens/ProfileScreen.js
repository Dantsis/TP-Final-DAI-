import React from 'react';
import { View, Text } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>Perfil</Text>
      <Text style={{ color: colors.mutted, marginTop: 8 }}>
        Aquí podrías agregar login, rol (organizador/staff), etc.
      </Text>
    </View>
  );
}
