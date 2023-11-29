import {
  createFormElement,
  createFormsContainer,
  createTextButton,
  createIconButton,
} from "../../../utility/forms.js";
const parents = [
  {
    id: 1,
    name: "Hans",
    email: "hahsh@lhs.dk",
    phone: "12345678",
    relation: "far",
  },
  {
    id: 2,
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

const createCard = (parent) => {
  // LOG STUDENT FOR TESTING PURPOSES
  console.log(parent);

  // Create card div
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  // Add info container to card
  const infoContainer = createInfoContainer(parent);
  cardDiv.appendChild(infoContainer);
  const buttons = createButtons(parent);
  cardDiv.appendChild(buttons);

  // Add card to main
  main.appendChild(cardDiv);
};

const createInfoContainer = (parent) => {
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");

  const name = document.createElement("h2");
  name.innerText = shortenName(parent.name);

  // Add name to info container
  infoContainer.appendChild(name);

  // Add info boxes to info container
  const relationBox = createInfoBox("Relation", parent.relation);
  infoContainer.appendChild(relationBox);

  const phoneBox = createInfoBox("Telefon", parent.phone);
  infoContainer.appendChild(phoneBox);

  const emailBox = createInfoBox("Email", parent.email);
  infoContainer.appendChild(emailBox);

  return infoContainer;
};

const createButton = (parent, text, htmlClass, onClick) => {
  const button = document.createElement("button");
  button.classList.add("button");
  button.classList.add(htmlClass);
  button.dataset.parentId = parent.id;
  button.innerText = text;
  button.addEventListener("click", onClick);

  return button;
};

const createButtons = (parent) => {
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  const deleteButton = createButton(parent, "Slet", "delete-btn", () => {
    modal.style.display = "flex";
  }); //TODO: Delete parent
  buttonsContainer.appendChild(deleteButton);

  const editButton = createButton(parent, "Rediger", "edit-btn", () => {}); //TODO: Edit parent
  buttonsContainer.appendChild(editButton);

  const saveButton = createButton(parent, "Gem", "save-btn", () => {}); //TODO: Save parent
  saveButton.style.display = "none";
  buttonsContainer.appendChild(saveButton);

  return buttonsContainer;
};

const createInfoBox = (label, value) => {
  const infoBox = document.createElement("div");
  infoBox.classList.add("info-box");

  const labelElement = document.createElement("p");
  labelElement.classList.add("label");
  labelElement.innerText = label;

  const valueElement = document.createElement("p");
  valueElement.innerText = value;

  infoBox.appendChild(labelElement);
  infoBox.appendChild(valueElement);

  return infoBox;
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
  parents.forEach((parent) => createCard(parent));
});
