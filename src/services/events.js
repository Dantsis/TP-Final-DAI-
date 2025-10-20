import { db } from './firebase';
import {
  collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore';

const EVENTS = 'events';

export async function listEvents() {
  const snap = await getDocs(collection(db, EVENTS));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getEvent(id) {
  const ref = doc(db, EVENTS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Evento no encontrado');
  return { id: snap.id, ...snap.data() };
}

export async function createEvent(payload) {
  const ref = await addDoc(collection(db, EVENTS), {
    title: payload.title || 'Sin título',
    description: payload.description || '',
    venue: payload.venue || { name: '', lat: null, lng: null, address: '' },
    posterUrl: payload.posterUrl || '',
    createdAt: serverTimestamp()
  });
  return ref.id;
}

export async function updateEvent(id, payload) {
  await updateDoc(doc(db, EVENTS, id), payload);
}

export async function removeEvent(id) {
  await deleteDoc(doc(db, EVENTS, id));
}
