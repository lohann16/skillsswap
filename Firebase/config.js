// Firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Paste the firebaseConfig object Firebase gave you when you registered

const firebaseConfig = {
  apiKey: "AIzaSyCicoWfcVKidP-tZTGBo9CyWp0NZQiGGVs",
  authDomain: "skillswapp-fe534.firebaseapp.com",
  databaseURL:"https://skillswapp-fe534-default-rtdb.firebaseio.com",
  projectId: "skillswapp-fe534",
  storageBucket: "skillswapp-fe534.firebasestorage.app",
  messagingSenderId: "18771358630",
  appId: "1:18771358630:web:06839c3bf0aff696b61567"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;