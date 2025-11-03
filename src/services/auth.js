import { auth } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

let ready;

export function ensureAnonAuth() {
  if (ready) return ready;
  ready = new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) await signInAnonymously(auth);
        resolve(auth.currentUser);
      } catch (e) {
        reject(e);
      } finally {
        unsub();
      }
    });
  });
  return ready;
}
