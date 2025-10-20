import React from 'react';
import { View } from 'react-native';
export default function Spacer({ size = 16 }) {
  return <View style={{ height: size, width: size }} />;
}
