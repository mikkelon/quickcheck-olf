import { writeNotice } from "../../../utility/realtime.js";
// import data from "./data.json";
import {
  getParentInfoBySessionCookie,
  getStudentsBySessionCookie,
} from "../../../utility/datahandler.js";

let parents = null;
let children = null;
const alert = document.querySelector("#alert");

async function initGui() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  createChildrenGui();
}

document.addEventListener("DOMContentLoaded", initGui);

document.addEventListener("DOMContentLoaded", function () {
  const sendBtn = document.querySelector(".submit-btn");
  const clearBtn = document.querySelector(".cancel-btn");

  // 'Send'-knappen
  sendBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    alert.innerHTML = "";
    const textArea = document.querySelector(".text-area");
    const childrenCheckboxes = document.querySelectorAll(
      '.child-container input[type="checkbox"]'
    );
    const sendDateInput = document.getElementById("sendDate");
    sendDateInput.valueAsDate = new Date();

    const senderName = document.getElementById("parents-dropdown").value;
    const sender = parents.find(parent => parent.name === senderName);

    const message = textArea.value;

    const selectedChildren = Array.from(childrenCheckboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => {
        const name = checkbox.value;
        const child = children.find(child => child.name === name);
        return { name: child.name, class: child.class.colorLabel };
      });

    const sendDate = sendDateInput.value;

    const confirmation = window.confirm(
      "Er du sikker på at du vil du sende beskeden?"
    );

    if (confirmation) {
      const data = {
        sendDate: sendDate,
        sender: sender,
        concerns: selectedChildren,
        message: message,
      };

      console.log(data);

      // Sørg for at sende alle nødvendige parametre
      try {
        await writeNotice(data);
        alertMsg("Beskeden er sendt", true);
      } catch (error) {
        console.error(error);
        alertMsg("Der skete en fejl ved afsendelse af beskeden", false);
      }
    }

    textArea.value = "";
    childrenCheckboxes.forEach(checkbox => (checkbox.checked = false));
  });

  // 'Ryd'-knappen
  clearBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const textArea = document.querySelector(".text-area");
    const childrenCheckboxes = document.querySelectorAll(
      '.child-container input[type="checkbox"]'
    );
    const senderSelect = document.getElementById("parents-dropdown");
    const sendDateInput = document.getElementById("sendDate");

    alert.innerHTML = "";
    textArea.value = "";
    childrenCheckboxes.forEach(checkbox => (checkbox.checked = false));
    senderSelect.selectedIndex = 0;
    sendDateInput.valueAsDate = new Date();
  });
});

async function createChildrenGui() {
  children = await getStudentsBySessionCookie();

  // Få fat i det overordnede container-element
  const childrenContainer = document.getElementById("children");

  children.forEach(child => {
    const childContainer = document.createElement("div");
    childContainer.classList.add("child-container"); // Tilføjet ny klasse for styling (valgfrit)

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = child.id;
    checkbox.name = "child";
    checkbox.value = child.name;

    const label = document.createElement("label");
    label.classList.add("label-child");
    label.htmlFor = child.id;
    label.textContent = `${child.name} (${child.class.colorLabel})`;

    childContainer.appendChild(checkbox);
    childContainer.appendChild(label);

    childrenContainer.appendChild(childContainer);
  });

  const parentInfo = await getParentInfoBySessionCookie();
  parents = parentInfo.parents;

  const dropdown = document.getElementById("parents-dropdown");

  parents.forEach(parent => {
    dropdown.innerHTML += `
            <option value="${parent.name}">${parent.name} ${
      parent.relation ? parent.relation : ""
    }</option>
        `;
  });

  const sendDateInput = document.getElementById("sendDate");
  sendDateInput.valueAsDate = new Date();
}

const alertMsg = (message, success) => {
  window.scrollTo(0, 0); // scroll to top of page

  alert.innerHTML = `<p>${message}</p>`;

  // remove existing classes
  alert.classList.remove("success");
  alert.classList.remove("error");

  alert.classList.add(success ? "success" : "error");
};
