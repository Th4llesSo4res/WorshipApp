// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwlqHnMeT4K6GnCXgddKisSBJ-__w5Sw8",
  authDomain: "worshipapp-95d4f.firebaseapp.com",
  projectId: "worshipapp-95d4f",
  storageBucket: "worshipapp-95d4f.firebasestorage.app",
  messagingSenderId: "278264505885",
  appId: "1:278264505885:web:0ab9e91d0ef86f065008f4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
