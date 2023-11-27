import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

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
const auth = getAuth(app);

export { auth };
