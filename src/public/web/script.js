import { requestSessionCookie } from "../utility/datahandler.js";
import { auth } from "../utility/firebase.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const loginBtn = document.getElementById("login");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userRecord = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userRecord.user.getIdToken();
    await requestSessionCookie(idToken);
    window.location.href = "./dashboard";
  } catch (error) {
    console.error(error);
  }
});
