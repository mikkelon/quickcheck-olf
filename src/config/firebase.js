// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJYnP1ZAcCoYD6_b_sfHRmqBEiB7wXlgc",
  authDomain: "quickcheck-254b9.firebaseapp.com",
  projectId: "quickcheck-254b9",
  storageBucket: "quickcheck-254b9.appspot.com",
  messagingSenderId: "691879315868",
  appId: "1:691879315868:web:3c4888319c3d10b96ea059",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };




