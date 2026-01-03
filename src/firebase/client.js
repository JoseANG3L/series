import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxoqwKraasspCk2xsE4lZAshNqNdqAKFY",
  authDomain: "luisfseries.firebaseapp.com",
  projectId: "luisfseries",
  storageBucket: "luisfseries.firebasestorage.app",
  messagingSenderId: "269015630272",
  appId: "1:269015630272:web:df229157fa0ba58c380825"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);