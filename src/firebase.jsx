// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs9YVfweYNvGrgkmWmzQNLh4M93_1nJ-g",
  authDomain: "tracker-11c05.firebaseapp.com",
  projectId: "tracker-11c05",
  storageBucket: "tracker-11c05.firebasestorage.app",
  messagingSenderId: "589487276900",
  appId: "1:589487276900:web:7945391e1b9b75bca3f071",
  measurementId: "G-TS9WCC2E8Q"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services and export them
export const auth = getAuth(app);
export const db = getFirestore(app);