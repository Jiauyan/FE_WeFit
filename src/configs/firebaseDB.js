import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8V9R_P0I415Uz7M2mjFsbH7ZuQvDOLE0",
  authDomain: "wefit-90996.firebaseapp.com",
  databaseURL: "https://wefit-90996-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wefit-90996",
  storageBucket: "wefit-90996.appspot.com",
  messagingSenderId: "482849020512",
  appId: "1:482849020512:web:9783b2228c2070914a8105",
  measurementId: "G-VQ6N5K29JN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app);

export default app;
