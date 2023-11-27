import {
  getRandomParentStudents,
  toggleStudentCheckIn,
  getStudentsByParentId,
} from "../../../../utility/datahandler.js";
import config from "../../../utility/config.js";

// Static DOM elements
const main = document.querySelector("main");

// Hardcoded students for testing purposes
let students = [
  {
    id: "KeDx34IDddihmuM8P4pV",
    classId: "Y1lzso2ntN1CyyRemzaL",
    parentsId: "0cwxE83RrmMFJUS0uCNq",
    name: "Maria Olsen Vestergaard Eriksen Magnussen",
    birthday: "2015-02-18",
    class: {
      class: "1",
      colorLabel: "Grøn",
    },
    checkedIn: false,
  },
  {
    id: "Xfsa8u7V26afOQWEB3gB",
    name: "Laura Mikkelsen",
    parentsId: "0cwxE83RrmMFJUS0uCNq",
    classId: "4tRapRljbXu3hsoIwHfc",
    checkedIn: true,
    birthday: "2016-04-30",
    class: {
      class: "2",
      colorLabel: "Blå",
    },
  },
];

const createCard = (student) => {
  // LOG STUDENT FOR TESTING PURPOSES
  console.log(student);

  // Create card div
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  // Add left container to card
  const leftContainer = createLeftContainer(student);
  cardDiv.appendChild(leftContainer);

  // Add info container to card
  const infoContainer = createInfoContainer(student);
  cardDiv.appendChild(infoContainer);

  // Add card to main
  main.appendChild(cardDiv);
};

const createLeftContainer = (student) => {
  // Create left container
  const leftContainer = document.createElement("div");
  leftContainer.classList.add("left-container");

  // Add avatar to left container
  const avatar = createAvatar(student);
  leftContainer.appendChild(avatar);

  // Add buttons to left container
  const buttons = createButtons(student);
  buttons.forEach((button) => leftContainer.appendChild(button));

  // Return left container
  return leftContainer;
};

const createAvatar = (student) => {
  // Create avatar div
  const avatar = document.createElement("div");
  avatar.classList.add("avatar-container");

  // Create avatar image
  const image = document.createElement("img");
  image.src = "../../../../assets/avatar-placeholder.png";
  image.alt = "Avatar";
  image.classList.add("avatar");

  // Add image to avatar
  avatar.appendChild(image);

  // Create status indicator
  const statusIndicator = document.createElement("img");
  const statusImgSrc = student.checkedIn
    ? "check-circle-bold.svg"
    : "close-circle-bold.svg";
  statusIndicator.src = `../../../../assets/icons/${statusImgSrc}`;
  statusIndicator.alt = "Status indicator";
  statusIndicator.classList.add("status");

  // Add status indicator to avatar
  avatar.appendChild(statusIndicator);

  // Return avatar
  return avatar;
};

const createButtons = (student) => {
  const buttons = [];

  // Create check in/out button
  const checkBtn = document.createElement("button");
  checkBtn.classList.add("check-btn");

  if (!student.checkedIn) {
    checkBtn.innerText = "Tjek ind";
    checkBtn.classList.add("check-in");
  } else {
    checkBtn.innerText = "Tjek ud";
    checkBtn.classList.add("check-out");
  }

  // Add event listener to check in/out button
  checkBtn.addEventListener("click", () => {
    //TODO
    console.log("Check in/out button clicked for student: ", student.id);
  });

  // Add check in/out button to buttons array
  buttons.push(checkBtn);

  // Create notes button
  const notesBtn = document.createElement("button");
  notesBtn.innerText = "Noter";
  notesBtn.style.backgroundColor = "#8774FF";

  // Add event listener to notes button
  notesBtn.addEventListener("click", () => {
    //TODO
    console.log("Notes button clicked for student: ", student.id);
  });

  // Add notes button to buttons array
  buttons.push(notesBtn);

  return buttons;
};

const createInfoContainer = (student) => {
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");

  const name = document.createElement("h2");
  name.innerText = shortenName(student.name);

  // Add name to info container
  infoContainer.appendChild(name);

  // Add info boxes to info container
  const birthdayBox = createInfoBox("Fødselsdag", student.birthday);
  infoContainer.appendChild(birthdayBox);

  const classText = `${student.class.class}. ${student.class.colorLabel}`;
  const classBox = createInfoBox("Klasse", classText);
  infoContainer.appendChild(classBox);

  return infoContainer;
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
  students.forEach((student) => createCard(student));
});
