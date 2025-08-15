// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwPXhHGvqGpeEopstzE7a1MvXoaeh9odA",
  authDomain: "alumnisocialnetwork-14f3d.firebaseapp.com",
  projectId: "alumnisocialnetwork-14f3d",
  storageBucket: "alumnisocialnetwork-14f3d.firebasestorage.app",
  messagingSenderId: "338730822916",
  appId: "1:338730822916:web:a6b3acde3247b5380fb451",
  measurementId: "G-TFTDENGYH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;