import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function TicketQRCode({ ticketId, size = 220, refProp }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {}
      <QRCode
        value={ticketId}
        size={size}
        getRef={(c) => {
          if (refProp) refProp.current = c;
        }}
         backgroundColor="#FFFFFF"
         color="#000000"
      />
    </View>
  );
}

