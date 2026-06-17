import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRbTf6sIoV9LVJk7zM83GfUQTzdksz9qw", // Foydalanuvchi taqdim etgan kalit
  authDomain: "clude-76782.firebaseapp.com",
  projectId: "clude-76782",
  storageBucket: "clude-76782.firebasestorage.app",
  messagingSenderId: "276659337503",
  appId: "1:276659337503:web:b294412c0e36e301b1582a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
