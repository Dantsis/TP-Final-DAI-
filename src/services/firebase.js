import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyANU0RJDGKAwLs0U-SK1mqfFwv4iCgmD3I",
  authDomain: "tp-dai-538ed.firebaseapp.com",
  projectId: "tp-dai-538ed",
  storageBucket: "tp-dai-538ed.firebasestorage.app",
  messagingSenderId: "667300719487",
  appId: "1:667300719487:web:2817f53fc66f18cae8084a"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);