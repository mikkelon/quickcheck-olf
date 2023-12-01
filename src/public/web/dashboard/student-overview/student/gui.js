import {
  deleteStudent,
  getClasses,
  getParentsById,
  getStudentById,
  toggleStudentCheckIn,
  updateStudent,
  updateParents,
  getAgreementsByStudentId,
} from "../../../../utility/datahandler.js";
import {
  createParent,
  deleteParent,
  getAllParents,
  updateParent,
  deleteAgreement,
  createNewAgreement,
} from "./crud.js";
import {
  createDropdownFormElement,
  createFormElement,
  createFormsContainer,
  createIconButton,
  createTextButton,
} from "../../../../utility/forms.js";
import config from "../../../../utility/config.js";

const checkMark = config.assets.icons.check;
const crossMark = config.assets.icons.cross;

let editing = false;
let child;

async function initGUI() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  child = await getStudentById(id);

  const colorLabels = await getClasses();

  const clazzDropdown = document.getElementById("class-dropdown");
  const dropdown = createDropdownFormElement(
    "Klasse",
    "class",
    colorLabels,
    "color-id",
    child.classId
  );
  clazzDropdown.appendChild(dropdown);

  const avatar = document.getElementById("avatar");
  const nameHeader = document.getElementById("name-header");
  const birthdayElement = document.getElementById("birthday");

  nameHeader.innerHTML = child.name;

  birthdayElement.value = child.birthday;

  setStatus(child.checkedIn);

  await getParentsById(child.parentsId).then((res) => {
    res.parents.map((parent) => {
      createParent(parent.name, parent.phone, parent.email, parent.relation);
    });
  });

  await setParents();

  setEditing(false);
  createAgreementsGui();

  const closeBtn = document.getElementById("closeBtn");
  closeBtn.addEventListener("click", () => {
    agreementModal.style.display = "none";
  });
}

function addButtons() {
  const customizeButtons = document.getElementById("buttons-container");
  customizeButtons.innerHTML = "";

  if (editing) {
    const saveBtn = createTextButton(
      "save",
      "Gem",
      () => {
        editing = !editing;
        setEditing(editing);

        save();
      },
      "#56E87F"
    );

    const cancelbtn = createTextButton(
      "cancel",
      "Annuller",
      () => {
        editing = !editing;
        setEditing(editing);
      },
      "#FF5656"
    );

    customizeButtons.appendChild(cancelbtn);
    customizeButtons.appendChild(saveBtn);
  } else {
    const deleteBtn = createTextButton(
      "delete",
      "Slet elev",
      () => {
        document.getElementById("delete-modal").style.display = "block";
      },
      "#FF5656"
    );

    const editBtn = createTextButton(
      "edit",
      "Rediger",
      () => {
        editing = !editing;
        setEditing(editing);
      },
      "#8774FF"
    );

    customizeButtons.appendChild(deleteBtn);
    customizeButtons.appendChild(editBtn);
  }
}

function setEditing(editing) {
  const forms = document.querySelectorAll(".forms-input");

  forms.forEach((form) => {
    const isExcluded = form.classList.contains("exclude-from-disabling");
    // Disable or enable based on the condition
    form.disabled = isExcluded ? form.disabled : !editing;
  });

  setParents();
  addButtons();
}

function setStatus(checkedIn) {
  const status = document.getElementById("status");
  status.src = checkedIn ? checkMark : crossMark;
  status.style.backgroundColor = checkedIn ? "#4bb14e" : "#FF5656";

  checkInOutBtn.innerHTML = checkedIn ? "Tjek Ud" : "Tjek Ind";
  checkInOutBtn.style.backgroundColor = checkedIn ? "#FF5656" : "#56E87F";
}

async function setParents() {
  const parentsContainer = document.getElementById("parents-container");
  parentsContainer.innerHTML = "";

  const parents = getAllParents();

  parents.forEach((parent, index) => {
    const parentDiv = createParentElement(parent, index);
    parentsContainer.appendChild(parentDiv);
  });

  if (editing) {
    const parentButton = createAddButton(
      "createParent",
      "Tilføj Forældre",
      () => {
        // Handle the click event for adding a child
        // You can show a form or perform any other action
        console.log("Add Parent button clicked");
        createParent("", "", "", "");
        setParents();
      }
    );

    parentsContainer.appendChild(parentButton);
  }
}

// Function to create a button for adding a parent or child
function createAddButton(id, text, clickHandler) {
  const addButton = document.createElement("div");
  addButton.id = id;
  addButton.classList.add("container", "createBtn");

  addButton.innerHTML += `<svg class ="add" width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
        fill="#56E87F" />
    <path fill-rule="evenodd" clip-rule="evenodd"
        d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
        fill="#56E87F" />
</svg>`;
  addButton.innerHTML += `<p">${text}</p>`;

  addButton.addEventListener("click", clickHandler);

  return addButton;
}

// Function to create a parent element
function createParentElement(parent, index) {
  const parentDiv = document.createElement("div");
  parentDiv.classList.add("container");

  const headerDiv = document.createElement("div");
  if (editing) {
    headerDiv.classList.add("container-header");
    const deleteIcon = createIconButton(
      "delete",
      "<i class='fas fa-trash'></i>",
      () => {
        const confirmed = confirm("Er du sikker på, at du vil slette denne forælder?");
        if (confirmed) deleteParentHandler(index);
      }
    );
    deleteIcon.classList.add("delete-parent");
    deleteIcon.style.backgroundColor = "#FF5656";
    headerDiv.appendChild(deleteIcon);
  }

  const nameForm = createFormElement(
    "Fulde navn",
    "text",
    "name",
    parent.name,
    (input) => {
      console.log("Name changed to:", input);
      updateParent(index, "name", input);
    }
  );

  const relationForm = createFormElement(
    "Relation",
    "text",
    "relation",
    parent.relation,
    (input) => {
      console.log("Relation changed to:", input);
      updateParent(index, "relation", input);
    }
  );

  const phoneForm = createFormElement(
    "Telefonnummer",
    "text",
    "phone",
    parent.phone,
    (input) => {
      console.log("Phone changed to:", input);
      updateParent(index, "phone", input);
    }
  );

  const emailForm = createFormElement(
    "E-mail",
    "text",
    "email",
    parent.email,
    (input) => {
      console.log("Email changed to:", input);
      updateParent(index, "email", input);
    }
  );

  const formsContainer = createFormsContainer([
    nameForm,
    relationForm,
    phoneForm,
    emailForm,
  ]);

  parentDiv.appendChild(headerDiv);
  parentDiv.appendChild(formsContainer);

  return parentDiv;
}

// Event handler for deleting a parent
function deleteParentHandler(index) {
  const deletedParent = deleteParent(index);
  console.log("Deleted Parent:", deletedParent);

  // Update the UI
  setParents();
}

// Event handler for deleting an agreement
function deleteAgreementHandler(agreementId) {
  const deletedAgreement = deleteAgreement(agreementId);
  console.log("Deleted agreement:", deletedAgreement);
  // Update the UI
  createAgreementsGui();
}

function save() {
  const birthday = document.getElementById("birthday").value;

  const dropdown = document.getElementById("class");
  const classId =
    dropdown.options[dropdown.selectedIndex].getAttribute("color-id");

  console.log(birthday, classId, child.parentsId);

  child.birthday = birthday;
  child.classId = classId;

  const parents = getAllParents();

  updateStudent(child);
  updateParents(child.parentsId, { parents });

  console.log("Saved");
}

const checkInOutBtn = document.getElementById("checkInOutBtn");
checkInOutBtn.addEventListener("click", () => {
  child.checkedIn = !child.checkedIn;
  setStatus(child.checkedIn);

  toggleStudentCheckIn(child.id);
});

const agreementModal = document.getElementById("note-modal");

const addAgreement = document.querySelector(".add-note-btn");
addAgreement.addEventListener("click", () => {
  // Reset checkboxes
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  agreementModal.style.display = "block";
});

const closeDeleteBtn = document.getElementById("closeDeleteBtn");
closeDeleteBtn.addEventListener("click", () => {
  document.getElementById("delete-modal").style.display = "none";
});

const deleteBtn = document.getElementById("delete-child-btn");
deleteBtn.addEventListener("click", () => {
  console.log("Delete child and go to previous page");
  deleteStudent(child.id);
  window.location.href = "../index.html";
});

document.addEventListener("DOMContentLoaded", initGUI);

const saveAgreement = document.querySelector(".note-save-btn");
saveAgreement.addEventListener("click", async () => {
  const descriptionField = document.getElementById("note-description");

  const message = descriptionField.value;

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const selectedDays = new Set();

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked && checkbox.id !== "everyday") {
      selectedDays.add(Number(checkbox.name));
    }
  });

  // Check if "Alle dage" checkbox is selected
  const everydayCheckbox = document.getElementById("everyday");
  if (everydayCheckbox.checked) {
    const otherDays = [1, 2, 3, 4, 5, 6, 0]; // Monday to Sunday
    otherDays.forEach((day) => selectedDays.add(day));
  }

  if (selectedDays.size === 0) {
    alert("Vælg venligst en eller flere dage");
    return;
  }

  await createNewAgreement(child.id, message, Array.from(selectedDays));
  createAgreementsGui();
  descriptionField.value = "";
  agreementModal.style.display = "none";
});

async function createAgreementsGui() {
  try {
    const agreements = await getAgreementsByStudentId(child.id);

    const agreementContainer = document.getElementById("notes");

    agreementContainer.innerHTML = "";

    if (agreements.length === 0) {
      const noAgreements = document.createElement("p");
      noAgreements.classList.add("no-notes");
      noAgreements.innerHTML = "Ingen faste aftaler";
      agreementContainer.appendChild(noAgreements);
    }

    agreements.forEach((agreement, index) => {
      const agreementElm = createAgreementElement(agreement);
      agreementContainer.appendChild(agreementElm);
    });
  } catch (error) {
    console.log(error);
  }
}
function translateValidDays(agreement) {
  const daysMapping = {
    0: "Søndag",
    1: "Mandag",
    2: "Tirsdag",
    3: "Onsdag",
    4: "Torsdag",
    5: "Fredag",
    6: "Lørdag",
  };

  const days = agreement.daysValid;
  if (days.length === 7) {
    return ["Alle dage"];
  }
  if (days.length === 0) {
    return ["Ingen valgte dage"];
  }
  const translatedDays = days.map((day) => daysMapping[day]);
  return translatedDays;
}

function createAgreementElement(agreement) {
  // Opret hovedelementet <div class="note">
  const agreementDiv = document.createElement("div");
  agreementDiv.classList.add("note");

  // Opret dropdown-containeren <div class="dropdown">
  const dropdownDiv = document.createElement("div");
  dropdownDiv.classList.add("dropdown");

  dropdownDiv.innerHTML = `
  <div class="note-description">
  ${agreement.message}

  <span class="valid-days">${translateValidDays(agreement)}</span>
  </div>`;

  // Opret dropdown-indholdet <div class="dropdown-content">
  const dropdownContentDiv = document.createElement("div");
  dropdownContentDiv.classList.add("dropdown-content");

  // Opret en input for beskrivelsen
  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";

  // Tilføj input-elementet til dropdown-indholdet

  // Opret delete-knappen <div class="note-delete">
  const deleteBtnDiv = document.createElement("div");
  deleteBtnDiv.classList.add("note-delete");
  deleteBtnDiv.style.backgroundImage = `url(${config.assets.icons.closeSquareThin})`;

  // Add hover effect
  deleteBtnDiv.addEventListener("mouseenter", () => {
    deleteBtnDiv.style.backgroundImage = `url(${config.assets.icons.closeSquareBold})`;
    deleteBtnDiv.style.cursor = "pointer";
  });

  deleteBtnDiv.addEventListener("mouseleave", () => {
    deleteBtnDiv.style.backgroundImage = `url(${config.assets.icons.closeSquareThin})`;
    deleteBtnDiv.style.cursor = "default";
  });

  // Tilføj en event listener til delete-knappen
  deleteBtnDiv.addEventListener("click", () => {
    const confirmDelete = confirm("Er du sikker på, at du vil slette aftalen?");
    if (confirmDelete) {
      deleteAgreementHandler(agreement.id);
    }
  });

  // Tilføj dropdown-containeren og delete-knappen til hovedelementet
  dropdownDiv.appendChild(deleteBtnDiv);
  agreementDiv.appendChild(dropdownDiv);

  return agreementDiv;
}

// const index = 0; // Dette skal være det aktuelle index for noten
// const noteElement = createNoteElement(note, index);
// noteContainer.appendChild(noteElement);
