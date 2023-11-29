import {
  addParent,
  getParentInfoBySessionCookie,
  updateParents,
  deleteParentByIndex,
} from "../../../utility/datahandler.js";
let parentsObj = {};

// Static DOM elements
const main = document.querySelector("main");
const addParentButton = document.getElementById("outer-add-card");
const modal = document.querySelector(".modal");
const cancelButton = document.getElementById("cancel");
const acceptButton = document.getElementById("accept");

// Event Listeners

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

acceptButton.addEventListener("click", () => {
  const index = modal.dataset.id;
  deleteParent(index);
});

cancelButton.addEventListener("click", () => {
  modal.style.display = "none";
});

addParentButton.addEventListener("click", () => {
  const currentIndex = parentsObj.parents.length;
  const newCard = createCard(
    {
      name: "",
      relation: "",
      phone: "",
      email: "",
    },
    currentIndex
  );

  // Select name input
  const nameInput = newCard.querySelector(".name");
  nameInput.placeholder = "Navn";
  console.log(nameInput);

  toggleSaveEditButtons(newCard.dataset.id);
  toggleInputs(newCard.dataset.id);
  addParentButton.style.display = "none";
});

const createCard = (parent, index) => {
  // Create card div
  const cardDiv = document.createElement("div");
  cardDiv.dataset.id = index;
  cardDiv.classList.add("card");

  // Add info container to card
  const infoContainer = createInfoContainer(parent, index);
  cardDiv.appendChild(infoContainer);
  const buttons = createButtons(parent, index);
  cardDiv.appendChild(buttons);

  // Add card to main
  main.insertBefore(cardDiv, addParentButton);

  return cardDiv;
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
      if (index === parentsObj.parents.length) {
        deleteCard(index);
        addParentButton.style.display = "flex";
      } else {
        modal.dataset.id = index;
        modal.style.display = "flex";
      }
    },
    index
  ); //TODO: Delete parent
  buttonsContainer.appendChild(deleteButton);

  const editButton = createButton(
    "Rediger",
    "edit-btn",
    () => {
      toggleSaveEditButtons(index);
      toggleInputs(index);
    },
    index
  ); //TODO: Edit parent
  buttonsContainer.appendChild(editButton);

  const saveButton = createButton(
    "Gem",
    "save-btn",
    () => {
      addUpdateParent(index);
    },
    index
  ); //TODO: Save parent
  saveButton.style.display = "none";
  buttonsContainer.appendChild(saveButton);

  return buttonsContainer;
};

const toggleSaveEditButtons = (index) => {
  const saveButton = document.querySelector(`.save-btn[data-id="${index}"]`);
  const editButton = document.querySelector(`.edit-btn[data-id="${index}"]`);
  if (saveButton.style.display === "none") {
    saveButton.style.display = "block";
    editButton.style.display = "none";
  } else {
    saveButton.style.display = "none";
    editButton.style.display = "block";
  }
};

const toggleInputs = (index) => {
  const inputs = document.querySelectorAll(`input[data-id="${index}"]`);
  inputs.forEach((input) => {
    if (input.disabled) {
      input.disabled = false;
      input.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    } else {
      input.disabled = true;
      input.style.backgroundColor = "transparent";
    }
  });
};

const deleteCard = (index) => {
  const card = document.querySelector(`.card[data-id="${index}"]`);
  card.remove();
};

const deleteParent = async (index) => {
  try {
    await deleteParentByIndex(parentsObj.id, index);
    parentsObj.parents.splice(index, 1);
    updateIndexes();
    deleteCard(index);
    modal.style.display = "none";
  } catch (error) {
    console.log(error);
    alert("Fejl - forælder findes ikke.");
  }
};

const addUpdateParent = async (index) => {
  const card = document.querySelector(`.card[data-id="${index}"]`);
  const nameInput = card.querySelector(".name");
  const relationInput = card.querySelector(".info-box:nth-child(2) input");
  const phoneInput = card.querySelector(".info-box:nth-child(3) input");
  const emailInput = card.querySelector(".info-box:nth-child(4) input");

  const parents = [
    {
      name: nameInput.value,
      relation: relationInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
    },
  ];
  if (index === parentsObj.parents.length) {
    // Add parent
    try {
      await addParent(parentsObj.id, parents[0]);
      toggleInputs(index);
      toggleSaveEditButtons(index);
      addParentButton.style.display = "flex";
      parentsObj.parents.push(parents[0]);
    } catch (error) {
      console.log(error);
      alert("Fejl - forælder findes ikke.");
    }
  } else {
    // Add other parents
    for (let i = 0; i < parentsObj.parents.length; i++) {
      if (i !== index) {
        parents.push(parentsObj.parents[i]);
      }
    }
    // Update parent
    try {
      await updateParents(parentsObj.id, { parents });

      // Update parentsObj
      parentsObj.parents = parents;

      toggleInputs(index);
      toggleSaveEditButtons(index);
    } catch (error) {
      console.log(error);
      alert("Fejl - forælder findes ikke.");
    }
  }
};

const updateIndexes = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.dataset.id = index;
    const buttons = card.querySelectorAll(".button");
    buttons.forEach((button) => {
      button.dataset.id = index;
    });
    const inputs = card.querySelectorAll("input");
    inputs.forEach((input) => {
      input.dataset.id = index;
    });
  });
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
  parentsObj = await getParentInfoBySessionCookie();
  console.log(parentsObj);

  // Create cards for students
  parentsObj.parents.forEach((parent, index) => createCard(parent, index));
  addParentButton.style.display = "flex";
});
