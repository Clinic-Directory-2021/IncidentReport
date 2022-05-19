import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAO-O8qNqCbyRFeCSPlIUHqMikYwwk2c5E",
  authDomain: "incident-report-499e1.firebaseapp.com",
  projectId: "incident-report-499e1",
  storageBucket: "incident-report-499e1.appspot.com",
  messagingSenderId: "37893181119",
  appId: "1:37893181119:web:4089c621a904368cdb800a",
  measurementId: "G-3KEX4V1DX5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);