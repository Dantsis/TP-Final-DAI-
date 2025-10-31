import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, Image } from 'react-native';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import PrimaryButton from '../components/PrimaryButton';
import { createEvent, getEvent, updateEvent } from '../services/events';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

export default function EventFormScreen({ route, navigation }) {
  const id = route?.params?.id;
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [venueName, setVenueName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  useEffect(() => {
    (async () => {
      if (id) {
        const e = await getEvent(id);
        setTitle(e.title || '');
        setDesc(e.description || '');
        setVenueName(e.venue?.name || '');
        setLat(e.venue?.lat?.toString?.() || '');
        setLng(e.venue?.lng?.toString?.() || '');
        setPosterUrl(e.posterUrl || '');
      }
    })();
  }, [id]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permiso requerido', 'Habilita el acceso a fotos.');
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!res.canceled) {
      const asset = res.assets[0];
      const blob = await (await fetch(asset.uri)).blob();
      const storageRef = ref(storage, `posters/${Date.now()}-${asset.fileName || 'img'}.jpg`);
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      setPosterUrl(url);
    }
  };

  const save = async () => {
    if (!title.trim()) return Alert.alert('Falta título', 'Escribe un título.');
    const payload = {
      title: title.trim(),
      description: desc.trim(),
      venue: {
        name: venueName.trim(),
        lat: lat ? Number(lat) : null,
        lng: lng ? Number(lng) : null,
        address: ''
      },
      posterUrl
    };
    if (id) {
      await updateEvent(id, payload);
    } else {
      const newId = await createEvent(payload);
      navigation.replace('DetalleEvento', { id: newId });
      return;
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.md }}>
      <Text style={{ color: colors.text, marginBottom: 6 }}>Título</Text>
      <TextInput value={title} onChangeText={setTitle}
        style={{ backgroundColor: '#111827', color: colors.text, padding: 12, borderRadius: 10 }} />

      <View style={{ height: spacing.md }} />
      <Text style={{ color: colors.text, marginBottom: 6 }}>Descripción</Text>
      <TextInput value={desc} onChangeText={setDesc} multiline
        style={{ backgroundColor: '#111827', color: colors.text, padding: 12, borderRadius: 10, minHeight: 80 }} />

      <View style={{ height: spacing.md }} />
      <Text style={{ color: colors.text, marginBottom: 6 }}>Lugar (nombre)</Text>
      <TextInput value={venueName} onChangeText={setVenueName}
        style={{ backgroundColor: '#111827', color: colors.text, padding: 12, borderRadius: 10 }} />

      <View style={{ height: spacing.md }} />
      <Text style={{ color: colors.text, marginBottom: 6 }}>Latitud</Text>
      <TextInput value={lat} onChangeText={setLat} keyboardType="decimal-pad"
        style={{ backgroundColor: '#111827', color: colors.text, padding: 12, borderRadius: 10 }} />

      <View style={{ height: spacing.md }} />
      <Text style={{ color: colors.text, marginBottom: 6 }}>Longitud</Text>
      <TextInput value={lng} onChangeText={setLng} keyboardType="decimal-pad"
        style={{ backgroundColor: '#111827', color: colors.text, padding: 12, borderRadius: 10 }} />

      <View style={{ height: spacing.md }} />
      <PrimaryButton title={posterUrl ? 'Cambiar póster' : 'Subir póster'} onPress={pickImage} />
      {posterUrl ? <Image source={{ uri: posterUrl }} style={{ height: 160, borderRadius: 10, marginTop: spacing.sm }} /> : null}

      <View style={{ height: spacing.lg }} />
      <PrimaryButton title="Guardar" onPress={save} />
    </ScrollView>
  );
}
