import { db, storage, auth } from './firebase';
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc,
  serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export async function uploadPosterAsync(localUri) {
  if (!localUri) return null;

  const resp = await fetch(localUri);
  const blob = await resp.blob();
  const uid = auth.currentUser?.uid || 'anon';
  const filename = `${uid}_${Date.now()}.jpg`;
  const storageRef = ref(storage, `posters/${filename}`);
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}


export async function createEvent(data) {
  
  let posterUrl = null;
  if (data.posterUri) {
    posterUrl = await uploadPosterAsync(data.posterUri);
  }
  const payload = {
    title: data.title?.trim() || 'Sin título',
    description: data.description?.trim() || '',
    venue: data.venue || null,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    posterUrl: posterUrl ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const refCol = collection(db, 'events');
  const docRef = await addDoc(refCol, payload);
  return docRef.id;
}


export async function updateEvent(id, data) {
  const refDoc = doc(db, 'events', id);
  let posterUrl = data.posterUrl ?? null;
  if (data.posterUri) {
    
    posterUrl = await uploadPosterAsync(data.posterUri);
  }
  const payload = {
    title: data.title?.trim() || 'Sin título',
    description: data.description?.trim() || '',
    venue: data.venue || null,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
    posterUrl,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(refDoc, payload);
  return true;
}


export async function getEvent(id) {
  const refDoc = doc(db, 'events', id);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) throw new Error('Evento no encontrado');
  return { id: snap.id, ...snap.data() };
}


export async function listEvents() {
  const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
