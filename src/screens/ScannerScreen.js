import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import QRFrame from '../components/QRFrame';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { parseTicketData } from '../services/tickets';
import { consumeTicket, getTicket } from '../services/tickets';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

const handleBarCodeScanned = async ({ type, data }) => {
  if (scanned) return;
  setScanned(true);

  try {
    const ticketId = String(data).trim();
    const tk = await getTicket(ticketId); 
    await consumeTicket(ticketId);        
    Alert.alert(
      '✅ Ticket válido',
      `Evento: ${tk.eventId}\nTicket: ${ticketId}\nEstado: CONSUMIDO`,
      [{ text: 'OK', onPress: () => setScanned(false) }]
    );
  } catch (e) {
    Alert.alert('⛔ Ticket inválido', String(e.message || e), [
      { text: 'OK', onPress: () => setScanned(false) }
    ]);
  }
};

  if (!permission) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <Text style={{ color: colors.text }}>Sin permiso de cámara</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarCodeScanned}
        />
        <QRFrame />
      </View>
      <View style={{ padding: spacing.md }}>
        <Text style={{ color: colors.mutted, textAlign: 'center' }}>Alineá el QR dentro del marco</Text>
      </View>
    </View>
  );
}
