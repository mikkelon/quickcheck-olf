import { auth } from "../utility/firebase.js";

const loginBtn = document.getElementById("login");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email, password);

  try {
    const userRecord = await auth.signInWithEmailAndPassword(email, password);

    console.log(userRecord);
  } catch (error) {
    console.error(error);
  }
});
