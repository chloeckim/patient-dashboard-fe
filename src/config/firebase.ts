// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV5BsuVV_IzLJ4asi9_8z7iCQO7Ji4Cho",
  authDomain: "finni-patient-dashboard.firebaseapp.com",
  projectId: "finni-patient-dashboard",
  storageBucket: "finni-patient-dashboard.appspot.com",
  messagingSenderId: "200156442145",
  appId: "1:200156442145:web:42763d3c15d9bdbaaffd60",
  measurementId: "G-3NE69B8PVE",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const googleProvider = new GoogleAuthProvider()
export const auth = getAuth(app)
export const db = getFirestore(app)
