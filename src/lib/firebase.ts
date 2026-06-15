import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { logger } from "./logger";

type AuthBridge = {
  onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000:web:000000"
};

// Only initialize if we have a "real-looking" key or we are forced to
let app: FirebaseApp | undefined;
let auth: AuthBridge = {
  onAuthStateChanged: (callback) => {
    queueMicrotask(() => callback(null));
    return () => {};
  }
};
let db: Firestore | null = null;

try {
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "tu_api_key") {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    const firebaseAuth = getAuth(app);
    auth = {
      onAuthStateChanged: (callback) => onAuthStateChanged(firebaseAuth, callback)
    };
    db = getFirestore(app);
  } else {
    logger.warn("[DEMO MODE] Firebase credentials missing. Using mock objects.");
    db = null;
  }
} catch (e) {
  logger.error("Firebase init error:", e);
}

export { auth, db };
