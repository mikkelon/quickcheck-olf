import { auth } from "../../utility/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {
  requestDeleteSessionCookie,
  getButtonsForRole,
} from "../../utility/datahandler.js";

const logoutBtn = document.getElementById("logout");
const buttonsContainer = document.querySelector(".buttons");

logoutBtn.addEventListener("click", async () => {
  try {
    await requestDeleteSessionCookie();
    await signOut(auth);
    window.location.href = "../";
  } catch (error) {
    console.error(error);
  }
});

// COLORS FOR THE BUTTONS
const colors = ["#ff5656", "#8774ff", "#56e87f"];

const createButton = (button, color) => {
  const buttonAnchor = document.createElement("a");
  buttonAnchor.href = button.link;
  buttonAnchor.style.backgroundColor = color;
  buttonAnchor.innerText = button.name;

  buttonsContainer.appendChild(buttonAnchor);
};

const createButtons = async () => {
  const buttons = await getButtonsForRole();

  buttons.forEach((button, index) => {
    createButton(button, colors[index % colors.length]);
  });
};

createButtons();
