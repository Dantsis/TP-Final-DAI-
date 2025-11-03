
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, Image, ScrollView } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';
import { createEvent, updateEvent, getEvent } from '../services/events';
import PlacesInput from '../components/PlacesInput';

export default function EventFormScreen({ route, navigation }) {
  const id = route.params?.id || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [placeId, setPlaceId] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [posterUri, setPosterUri] = useState(null);
  const [existingPosterUrl, setExistingPosterUrl] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const ev = await getEvent(id);
        setTitle(ev.title || '');
        setDescription(ev.description || '');
        setVenueName(ev.venue?.name || '');
        setVenueAddress(ev.venue?.address || '');
        setPlaceId(ev.venue?.placeId || null);
        setLat(ev.lat ?? null);
        setLng(ev.lng ?? null);
        setExistingPosterUrl(ev.posterUrl || null);
      } catch (e) {
        Alert.alert('Error', String(e.message || e));
      }
    })();
  }, [id]);

  const onSave = async () => {
    try {
      if (!title.trim()) {
        Alert.alert('Falta título', 'El título es obligatorio.');
        return;
      }
      if (!(lat != null && lng != null)) {
        Alert.alert('Ubicación', 'Elegí una dirección de la lista para fijar el lugar.');
        return;
      }

      setSaving(true);

      const data = {
        title,
        description,
        venue: venueName ? { name: venueName, address: venueAddress, placeId } : null,
        lat,
        lng,
        posterUri,
        posterUrl: existingPosterUrl,
      };

      if (id) {
        await updateEvent(id, data);
        Alert.alert('Guardado', 'Evento actualizado.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        const newId = await createEvent(data);
        Alert.alert('Guardado', 'Evento creado.', [
          { text: 'Ver detalle', onPress: () => navigation.replace('DetalleEvento', { id: newId }) },
          { text: 'OK' },
        ]);
      }
    } catch (e) {
      Alert.alert('Error al guardar', String(e.message || e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg, padding: spacing.md }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ color: colors.text, fontSize: 18, marginBottom: spacing.sm }}>
        {id ? 'Editar evento' : 'Nuevo evento'}
      </Text>

      {}
      <Text style={{ color: colors.text }}>Título</Text>
      <TextInput
        style={{
          backgroundColor: '#111827',
          color: '#fff',
          padding: 10,
          borderRadius: 8,
          marginBottom: spacing.md,
        }}
        value={title}
        onChangeText={setTitle}
        placeholder="Ej: MeetUp React"
        placeholderTextColor="#6b7280"
      />

      {}
      <Text style={{ color: colors.text }}>Descripción</Text>
      <TextInput
        style={{
          backgroundColor: '#111827',
          color: '#fff',
          padding: 10,
          borderRadius: 8,
          marginBottom: spacing.md,
        }}
        value={description}
        onChangeText={setDescription}
        placeholder="Detalles"
        placeholderTextColor="#6b7280"
        multiline
      />

      {}
      <Text style={{ color: colors.text, marginBottom: 6 }}>
        Lugar (buscá por dirección o nombre)
      </Text>
      <PlacesInput
        country="ar" 
        onPlacePicked={({ name, address, lat: la, lng: ln, placeId: pid }) => {
          setVenueName(name || '');
          setVenueAddress(address || '');
          setLat(la);
          setLng(ln);
          setPlaceId(pid || null);
        }}
      />
      {venueAddress ? (
        <Text style={{ color: colors.mutted, marginTop: 8 }}>📍 {venueAddress}</Text>
      ) : null}

      {}
      {posterUri || existingPosterUrl ? (
        <Image
          source={{ uri: posterUri || existingPosterUrl }}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 12,
            marginTop: spacing.md,
            marginBottom: spacing.md,
          }}
        />
      ) : null}

      {}
      <PrimaryButton
        title={saving ? 'Guardando...' : 'Guardar'}
        onPress={onSave}
        disabled={saving}
      />

      <View style={{ height: spacing.lg }} />
    </ScrollView>
  );
}

