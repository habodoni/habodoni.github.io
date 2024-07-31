// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA1ybVWLBhUZNcs01qe8xMWimrI_oFU-Ok",
    authDomain: "typer-4c4f4.firebaseapp.com",
    projectId: "typer-4c4f4",
    storageBucket: "typer-4c4f4.appspot.com",
    messagingSenderId: "1097817685245",
    appId: "1:1097817685245:web:361f8a10568c8b05fd9294",
    measurementId: "G-M8VB70WWCZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };