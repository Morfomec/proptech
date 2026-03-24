import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHtbMVSEGLA583Fa4iXRsZdRP4g3dcjH8",
  authDomain: "proptech-389cc.firebaseapp.com",
  projectId: "proptech-389cc",
  storageBucket: "proptech-389cc.firebasestorage.app",
  messagingSenderId: "516854384586",
  appId: "1:516854384586:web:82aa827aeb25ddabb4f133"
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
