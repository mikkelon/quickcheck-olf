import {
  createFormElement,
  createFormsContainer,
  createTextButton,
  createIconButton,
} from "../../../utility/forms.js";
const parents = [
  {
    name: "Hans",
    email: "hahsh@lhs.dk",
    phone: "12345678",
    relation: "far",
  },
  {
    name: "Hansss",
    email: "asdasda2@sads.kd",
    phone: "12345678",
    relation: "farfar",
  },
];

import {
  getRandomParentStudents,
  toggleStudentCheckIn,
  getStudentsByParentId,
} from "../../../../utility/datahandler.js";
import config from "../../../utility/config.js";

// Static DOM elements
const main = document.querySelector("main");

const modal = document.querySelector(".modal");
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

const cancelButton = document.getElementById("cancel");
cancelButton.addEventListener("click", () => {
  modal.style.display = "none";
});

const createCard = (parent, index) => {
  // LOG STUDENT FOR TESTING PURPOSES
  console.log(parent);

  // Create card div
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  // Add info container to card
  const infoContainer = createInfoContainer(parent, index);
  cardDiv.appendChild(infoContainer);
  const buttons = createButtons(parent, index);
  cardDiv.appendChild(buttons);

  // Add card to main
  main.appendChild(cardDiv);
};

const createInfoContainer = (parent, index) => {
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");

  const shortenedName = shortenName(parent.name);
  const inputName = document.createElement("input");
  inputName.value = shortenedName;
  inputName.disabled = true;
  inputName.dataset.id = index;
  inputName.classList.add("name");
  // Add name to info container
  infoContainer.appendChild(inputName);

  // Add info boxes to info container
  const relationBox = createInfoBox(parent, "Relation", parent.relation, index);
  infoContainer.appendChild(relationBox);

  const phoneBox = createInfoBox(parent, "Telefon", parent.phone, index);
  infoContainer.appendChild(phoneBox);

  const emailBox = createInfoBox(parent, "Email", parent.email, index);
  infoContainer.appendChild(emailBox);

  return infoContainer;
};

const createInfoBox = (parent, label, value, index) => {
  const infoBox = document.createElement("div");
  infoBox.classList.add("info-box");

  const labelElement = document.createElement("p");
  labelElement.classList.add("label");
  labelElement.innerText = label;

  const inputElement = document.createElement("input");
  inputElement.value = value;
  inputElement.disabled = true;
  inputElement.dataset.id = index;

  infoBox.appendChild(labelElement);
  infoBox.appendChild(inputElement);

  return infoBox;
};

const createButton = (text, htmlClass, onClick, index) => {
  const button = document.createElement("button");
  button.classList.add("button");
  button.classList.add(htmlClass);
  button.dataset.id = index;
  button.innerText = text;
  button.addEventListener("click", onClick);

  return button;
};

const createButtons = (parent, index) => {
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  const deleteButton = createButton(
    "Slet",
    "delete-btn",
    () => {
      modal.style.display = "flex";
    },
    index
  ); //TODO: Delete parent
  buttonsContainer.appendChild(deleteButton);

  const editButton = createButton(
    "Rediger",
    "edit-btn",
    () => {
      const inputs = document.querySelectorAll(`input[data-id="${index}"]`);
      inputs.forEach((input) => {
        input.disabled = false;
        input.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
      });
    },
    index
  ); //TODO: Edit parent
  buttonsContainer.appendChild(editButton);

  const saveButton = createButton("Gem", "save-btn", () => {}, index); //TODO: Save parent
  saveButton.style.display = "none";
  buttonsContainer.appendChild(saveButton);

  return buttonsContainer;
};

const shortenName = (name) => {
  const nameArray = name.split(" ");

  // If name is longer than 2 words, return first name and initials of the other names
  if (nameArray.length > 2) {
    const firstName = nameArray[0];
    let shortenedName = firstName;

    for (let i = 1; i < nameArray.length - 1; i++) {
      shortenedName += ` ${nameArray[i][0]}.`;
    }

    shortenedName += ` ${nameArray[nameArray.length - 1]}`;

    return shortenedName;
  } else {
    return name;
  }
};

// When DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
  // TODO: Get students from database

  // Create cards for students
  parents.forEach((parent, index) => createCard(parent, index));
});
