import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔑 Firebase Config (tumhara actual data)
const firebaseConfig = {
  apiKey: "AIzaSyDBkr2iy8nNUUV5793pTaBKtunlI-qndg8",
  authDomain: "sohail649-33ae5.firebaseapp.com",
  projectId: "sohail649-33ae5",
  storageBucket: "sohail649-33ae5.firebasestorage.app",
  messagingSenderId: "54937297531",
  appId: "1:54937297531:web:73f5001865e4a8be52b8de",
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
       
// 🔐 Auth (Google Login)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 📦 Firestore Database
export const db = getFirestore(app);
