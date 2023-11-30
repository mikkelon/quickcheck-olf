import {
  addParent,
  getParentInfoBySessionCookie,
  updateParents,
  deleteParentByIndex,
} from "../../../utility/datahandler.js";

// #--- Local variables ---#
let parentsObj = {};

// #--- Static DOM elements ---#
const main = document.querySelector("main");
const addParentButton = document.getElementById("outer-add-card");
const modal = document.querySelector(".modal");
const cancelButton = document.getElementById("cancel");
const acceptButton = document.getElementById("accept");

// #--- Event listeners ---#
// Modal click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Modal buttons
acceptButton.addEventListener("click", () => {
  const index = modal.dataset.id;
  deleteParent(index);
});
cancelButton.addEventListener("click", () => {
  modal.style.display = "none";
});

// Add parent button
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

  const nameInput = newCard.querySelector(".name");
  nameInput.placeholder = "Navn";
  console.log(nameInput);

  toggleSaveEditButtons(newCard.dataset.id);
  toggleInputs(newCard.dataset.id);
  addParentButton.style.display = "none";
});

// #--- Functions to create DOM elements ---#
const createCard = (parent, index) => {
  // Create card div
  const cardDiv = document.createElement("div");
  cardDiv.dataset.id = index;
  cardDiv.classList.add("card");

  // Add info container to card
  const infoContainer = createInfoContainer(parent, index);
  cardDiv.appendChild(infoContainer);

  // Add buttons to card
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
    (event) => {
      requestDeleteParent(event);
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

// #--- Functions to update DOM elements ---#
// Toggle save and edit buttons in the card
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

// Toggle inputs in the card
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

// Delete card by index
const deleteCardByIndex = (index) => {
  const card = document.querySelector(`.card[data-id="${index}"]`);
  card.remove();
};

// Delete a parent (calls deleteCard)
const requestDeleteParent = async (event) => {
  const index = parseInt(event.target.dataset.id);
  if (index === parentsObj.parents.length) {
    // If parent is not saved yet
    deleteCardByIndex(index);
    addParentButton.style.display = "flex";
  } else {
    // If parent is saved open modal
    modal.dataset.id = index;
    modal.style.display = "flex";
  }
};

const deleteParent = async (index) => {
  try {
    await deleteParentByIndex(parentsObj.id, index);
    parentsObj.parents.splice(index, 1);
    deleteCardByIndex(index);
    updateIndexes();
    modal.style.display = "none";
  } catch (error) {
    console.log(error);
    alert("Fejl - forælder findes ikke.");
  }
};

// Handle adding and updating a parent
const addUpdateParent = async (index) => {
  const card = document.querySelector(`.card[data-id="${index}"]`);
  const nameInput = card.querySelector(".name");
  const relationInput = card.querySelector(".info-box:nth-child(2) input");
  const phoneInput = card.querySelector(".info-box:nth-child(3) input");
  const emailInput = card.querySelector(".info-box:nth-child(4) input");

  const parent = {
    name: nameInput.value,
    relation: relationInput.value,
    phone: phoneInput.value,
    email: emailInput.value,
  };

  if (index === parentsObj.parents?.length) {
    // #-- Add parent --#
    // Add parent to local array
    parentsObj.parents.push(parent);
    try {
      await addParent(parentsObj.id, parent);
      toggleInputs(index);
      toggleSaveEditButtons(index);
      addParentButton.style.display = "flex";
    } catch (error) {
      console.log(error);
      alert("Fejl - forælder findes ikke.");
    }
  } else {
    // #-- Update parent --#
    // Update parent in local array
    parentsObj.parents[index] = parent;
    try {
      await updateParents(parentsObj.id, { parents: parentsObj.parents });

      toggleInputs(index);
      toggleSaveEditButtons(index);
    } catch (error) {
      console.log(error);
      alert("Fejl - forælder findes ikke.");
    }
  }
};

// Update indexes of cards, buttons and inputs (Used for all logic)
const updateIndexes = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    console.log("Updating index", index);
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

// Shorten name
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

// #--- When DOM is loaded ---#
document.addEventListener("DOMContentLoaded", async () => {
  parentsObj = await getParentInfoBySessionCookie();
  console.log(parentsObj);
  console.log(parentsObj.parents);

  // Create cards for students
  parentsObj.parents?.forEach((parent, index) => createCard(parent, index));
  addParentButton.style.display = "flex";
});
