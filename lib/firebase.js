// Firebase Client SDK
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBIiY2DGZJ3UxpqgFRYK8Lu-_gGw1IwdoE",
  authDomain: "aegis-2ebc0.firebaseapp.com",
  projectId: "aegis-2ebc0",
  storageBucket: "aegis-2ebc0.firebasestorage.app",
  messagingSenderId: "749716966794",
  appId: "1:749716966794:web:6464fdcacb3a137420cc73",
  measurementId: "G-PPBN9PZQNY"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
