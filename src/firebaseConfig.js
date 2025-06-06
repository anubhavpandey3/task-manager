// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeFCkZ9pTl1-56Nme2SUE0Z3BUXjHMx30",
  authDomain: "task-manager-app-4ff0d.firebaseapp.com",
  projectId: "task-manager-app-4ff0d",
  storageBucket: "task-manager-app-4ff0d.firebasestorage.app",
  messagingSenderId: "360530763927",
  appId: "1:360530763927:web:a703955a31d06fe9bb89d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);