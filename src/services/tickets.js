
import { db, auth, storage } from './firebase';
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  runTransaction,
  updateDoc,
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';


export async function createTicket(eventId) {
  const ownerUid =
    (auth && auth.currentUser && auth.currentUser.uid) ? auth.currentUser.uid : 'anon';

  const payload = {
    eventId,
    ownerUid,
    status: 'new',
    createdAt: serverTimestamp(),
    usedAt: null,
    qrUrl: null,
    qrUpdatedAt: null,
  };

  const refDoc = await addDoc(collection(db, 'tickets'), payload);
  return refDoc.id;
}


export async function getTicket(ticketId) {
  const refDoc = doc(db, 'tickets', ticketId);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) throw new Error('Ticket no encontrado');
  return { id: snap.id, ...snap.data() };
}


export async function consumeTicket(ticketId) {
  const refDoc = doc(db, 'tickets', ticketId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(refDoc);
    if (!snap.exists()) throw new Error('Ticket inválido');
    const data = snap.data();
    if (data.usedAt) throw new Error('Ticket ya usado');
    tx.update(refDoc, { usedAt: serverTimestamp(), status: 'used' });
  });
  return true;
}


export async function saveTicketQrPng(ticketId, base64png) {

  try {
    const tmp = FileSystem.cacheDirectory + `${ticketId}.png`;
    await FileSystem.writeAsStringAsync(tmp, base64png, { encoding: 'base64' });

    setTimeout(() => FileSystem.deleteAsync(tmp, { idempotent: true }).catch(() => {}), 5000);
  } catch {

  }

  const storageRef = ref(storage, `tickets_qr/${ticketId}.png`);
  const dataUrl = `data:image/png;base64,${base64png}`;


  await uploadString(storageRef, dataUrl, 'data_url');

  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, 'tickets', ticketId), {
    qrUrl: url,
    qrUpdatedAt: serverTimestamp(),
  });

  return url;
}

