// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "AIzaSyB2shFwfz8NKmp0ko9CGmckerPFeRZK4dg",
  authDomain: "solana-chat-f96ab.firebaseapp.com",
  projectId: "solana-chat-f96ab",
  storageBucket: "solana-chat-f96ab.firebasestorage.app",
  messagingSenderId: "1009082250887",
  appId: "1:1009082250887:web:9b841899512df361ee2a22",
  measurementId: "G-631ZK49M6K",
  databaseURL: "https://solana-chat-f96ab-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);