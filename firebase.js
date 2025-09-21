// Import necessary Firebase modules
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvuxgC0OCAH5Fwh7XhPpxUWBTxiZ9sc9I",
  authDomain: "chat-app-89aaf.firebaseapp.com",
  projectId: "chat-app-89aaf",
  storageBucket: "chat-app-89aaf.firebasestorage.app",
  messagingSenderId: "65512283013",
  appId: "1:65512283013:web:aa7c8c52cc0213a77802ec",
  measurementId: "G-CCTYGWM1M2",
};

// Initialize Firebase app, reusing existing instance if already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export initialized services
export { auth, db, storage };
