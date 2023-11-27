import { auth } from "../../utility/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { requestDeleteSessionCookie } from "../../utility/datahandler.js";

const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", async () => {
  try {
    await requestDeleteSessionCookie();
    await signOut(auth);
    window.location.href = "../";
  } catch (error) {
    console.error(error);
  }
});
