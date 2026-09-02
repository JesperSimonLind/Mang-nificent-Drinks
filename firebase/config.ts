import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwd-2xPTI4acwEBRVEJoaXkpgW-zTBO0Q",
  authDomain: "mag-nificent-drinks.firebaseapp.com",
  projectId: "mag-nificent-drinks",
  storageBucket: "mag-nificent-drinks.firebasestorage.app",
  messagingSenderId: "631310207043",
  appId: "1:631310207043:web:ad49ad0157f7758469acf6",
  measurementId: "G-BL2D5EY983",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
