import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

export default function PrimaryButton({ title, onPress, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: 'center'
      }, style]}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{title}</Text>
    </TouchableOpacity>
  );
}
