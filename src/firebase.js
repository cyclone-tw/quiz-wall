// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAlN5xlZ07kRa8H79OMViMU9y0Vu4CWc1w",
    authDomain: "quiz-wall-db.firebaseapp.com",
    projectId: "quiz-wall-db",
    storageBucket: "quiz-wall-db.firebasestorage.app",
    messagingSenderId: "699231447306",
    appId: "1:699231447306:web:0a59b3da0f931c5ef032f3",
    measurementId: "G-449R82C0LJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
// Initialize Cloud Firestore and get a reference to the service
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const db = getFirestore(app);
export const auth = getAuth(app);