import { requestSessionCookie } from "../../utility/datahandler.js";
import { auth } from "../../utility/firebase.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const loginBtn = document.getElementById("login");
const alert = document.getElementById("alert");

const toggleLoadingSpinner = () => {
  loginBtn.disabled = !loginBtn.disabled;
  loginBtn.innerHTML = loginBtn.disabled
    ? '<i class="fas fa-spinner fa-pulse fa-lg"></i>'
    : "Log ind";
};

const logIn = async () => {
  alert.innerHTML = "";
  toggleLoadingSpinner();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userRecord = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userRecord.user.getIdToken();
    await requestSessionCookie(idToken);
    window.location.href = "../dashboard";
  } catch (error) {
    console.error(error);
    showError();
  } finally {
    toggleLoadingSpinner();
  }
};

loginBtn.addEventListener("click", logIn);
document.body.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    loginBtn.focus();
    logIn();
  }
});

const showError = () => {
  window.scrollTo(0, 0); // scroll to top of page

  const text = document.createElement("p");
  text.innerText = "Ugyldig email eller password";

  alert.innerHTML = "";
  alert.appendChild(text);
};
