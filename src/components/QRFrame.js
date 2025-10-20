import React from 'react';
import { View } from 'react-native';

export default function QRFrame() {
  return (
    <View style={{
      position: 'absolute', top: '20%', left: '10%', right: '10%', bottom: '20%',
      borderColor: 'white', borderWidth: 2, borderRadius: 12
    }} />
  );
}
