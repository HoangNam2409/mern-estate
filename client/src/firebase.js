// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-fac11.firebaseapp.com",
  projectId: "mern-estate-fac11",
  storageBucket: "mern-estate-fac11.appspot.com",
  messagingSenderId: "92714852016",
  appId: "1:92714852016:web:ba376f1486989dc6062575"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);