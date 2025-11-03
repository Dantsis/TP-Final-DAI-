import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';
import TicketQRCode from '../components/TicketQRCode';
import { createTicket, getTicket, saveTicketQrPng } from '../services/tickets';

export default function TicketScreen({ route }) {
  const { eventId } = route.params;
  const [ticketId, setTicketId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const qrRef = useRef(null); 

  const handleCreate = async () => {
    try {
      setLoading(true);
      const id = await createTicket(eventId);
      setTicketId(id);
    } catch (e) {
      Alert.alert('Error', String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

const handleSavePng = () => {
  if (!ticketId) return;
  if (!qrRef.current || !qrRef.current.toDataURL) {
    Alert.alert('QR no listo', 'Reintenta en un segundo.');
    return;
  }
  setUploading(true);
  qrRef.current.toDataURL(async (base64) => {
    try {
      const url = await saveTicketQrPng(ticketId, base64); 
      Alert.alert('QR guardado', 'Subido a Storage y URL en Firestore.\n' + url);
    } catch (e) {
      Alert.alert('Error al subir QR', String(e.message || e));
      console.error('[saveTicketQrPng] error:', e);
    } finally {
      setUploading(false);
    }
  });
};


  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.lg }}>
      <Text style={{ color: colors.text, fontSize: 18, marginBottom: spacing.md }}>
        Tu entrada para este evento
      </Text>

      {ticketId ? (
        <>
          {}
          <TicketQRCode ticketId={ticketId} refProp={qrRef} />

          <Text style={{ color: colors.mutted, marginTop: spacing.md, textAlign: 'center' }}>
            Mostrá este QR en la entrada. ID: {ticketId}
          </Text>

          <View style={{ height: spacing.md }} />
          <PrimaryButton
            title={uploading ? 'Subiendo QR...' : 'Guardar QR en Storage'}
            onPress={handleSavePng}
            disabled={uploading}
          />
        </>
      ) : (
        <>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <PrimaryButton title="Generar ticket" onPress={handleCreate} />
          )}
          <Text style={{ color: colors.mutted, marginTop: spacing.md }}>
            Se emitirá un ticket único asociado a tu usuario anónimo actual.
          </Text>
        </>
      )}
    </View>
  );
}

