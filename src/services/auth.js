import { auth } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

let _readyPromise;

export function ensureAnonAuth() {
  if (_readyPromise) return _readyPromise;
  _readyPromise = new Promise((resolve, reject) => {
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
  return _readyPromise;
}
