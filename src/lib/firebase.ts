import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBCR9HnlSOWx4h-qg-L6_StN4t3OSbbMA8",
  authDomain: "charith-c014a.firebaseapp.com",
  projectId: "charith-c014a",
  storageBucket: "charith-c014a.firebasestorage.app",
  messagingSenderId: "471604447420",
  appId: "1:471604447420:web:41697e65cec06ddfab28b9",
  measurementId: "G-08Q08R6R3S"
};

// Initialize Firebase (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
