import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000:web:000000"
};

// Only initialize if we have a "real-looking" key or we are forced to
let app;
let auth: any = null;
let db: any = null;
let analytics: any = null;

try {
  if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "tu_api_key") {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("[DEMO MODE] Firebase credentials missing. Using mock objects.");
    // Mock minimal interface to avoid crashes
    auth = { onAuthStateChanged: (cb: any) => { cb(null); return () => {}; } };
    db = {};
  }
} catch (e) {
  console.error("Firebase init error:", e);
}

export { auth, db, analytics };
