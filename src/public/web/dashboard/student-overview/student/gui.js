import {
  deleteStudent,
  getClasses,
  getParentsById,
  getStudentById,
  toggleStudentCheckIn,
  updateStudent,
  updateParents,
  createNote,
  getNotesById,
} from "../../../../utility/datahandler.js";
import {
  createParent,
  deleteParent,
  getAllParents,
  updateParent,
  getAllNotes,
  deleteNote,
  createNewNote,
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
      createParent(parent.name, parent.phone, parent.email);
    });
  });

  await setParents();
  
  setEditing(false);
  createNotesGui();

  const closeBtn = document.getElementById("closeBtn");
  closeBtn.addEventListener("click", () => {
    noteModal.style.display = "none";
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
      "#4bb14e"
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
      "Slet",
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
      "#4bb14e"
    );

    customizeButtons.appendChild(deleteBtn);
    customizeButtons.appendChild(editBtn);
  }
}

function setEditing(editing) {
  const forms = document.querySelectorAll(".forms-input");

  forms.forEach((form) => {
    form.disabled = !editing;
  });

  setParents();

  addButtons();
}

function setStatus(checkedIn) {
  const status = document.getElementById("status");
  status.src = checkedIn ? checkMark : crossMark;
  status.style.backgroundColor = checkedIn ? "#4bb14e" : "#FF5656";

  checkInOutBtn.innerHTML = checkedIn ? "Tjek Ud" : "Tjek Ind";
  checkInOutBtn.style.backgroundColor = checkedIn ? "#FF5656" : "#4bb14e";
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
        createParent("", "", "");
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
        deleteParentHandler(index);
      }
    );
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

  const formsContainer = createFormsContainer([nameForm, phoneForm, emailForm]);

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

// Event handler for deleting a note
function deleteNoteHandler(index) {
  const deletedNote = deleteNote(index);
  console.log("Deleted note:", deletedNote);

  // Update the UI
  createNotesGui();
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

  alert(child.checkedIn ? "Barnet er tjekket ind" : "Barnet er tjekket ud");
});

const noteModal = document.getElementById("note-modal");

const addNote = document.querySelector(".add-note-btn");
addNote.addEventListener("click", () => {
  noteModal.style.display = "block";
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

const saveNote = document.querySelector(".note-save-btn");
saveNote.addEventListener("click", async () => {
  const titleField = document.getElementById("note-title");
  const title = titleField.value;

  const descriptionField = document.getElementById("note-description");
  const description = descriptionField.value;

  /*     const startDateField = document.getElementById("start-date")
        const startDate = startDateField.value; */

  /*     const endDateField = document.getElementById("end-date")
        const endDate = endDateField.value; */

  createNewNote(child.id, title, description);
  createNotesGui();

  titleField.value = "";
  descriptionField.value = "";

  noteModal.style.display = "none";
});

async function createNotesGui() {
  const notes = await getAllNotes(child.id);
  const noteContainer = document.getElementById("notes");

  noteContainer.innerHTML = "";

  if (notes.length === 0) {
    const noNotes = document.createElement("p");
    noNotes.classList.add("no-notes");
    noNotes.innerHTML = "Ingen noter";
    noteContainer.appendChild(noNotes);
  }

  notes.forEach((note, index) => {
    const noteElm = createNoteElement(note, index);
    noteContainer.appendChild(noteElm);
  });
}

function createNoteElement(note, index) {
  // Opret hovedelementet <div class="note">
  const noteDiv = document.createElement("div");
  noteDiv.classList.add("note");

  // Opret dropdown-containeren <div class="dropdown">
  const dropdownDiv = document.createElement("div");
  dropdownDiv.classList.add("dropdown");

  // Opret <p>-elementer for titel, startdato og slutdato
  const titleP = document.createElement("p");
  titleP.innerHTML = note.title;

  /* const startDateP = document.createElement("p");
    startDateP.innerHTML = note.startDate; */

  /*   const endDateP = document.createElement("p");
      endDateP.innerHTML = note.endDate; */

  // Opret dropdown-indholdet <div class="dropdown-content">
  const dropdownContentDiv = document.createElement("div");
  dropdownContentDiv.classList.add("dropdown-content");

  // Opret <p>-element for beskrivelse
  const descriptionP = document.createElement("p");
  descriptionP.innerHTML = note.description;

  // Tilføj <p>-elementet til dropdown-indholdet
  dropdownContentDiv.appendChild(descriptionP);

  // Tilføj <p>-elementerne til dropdown-containeren
  /*   dropdownDiv.appendChild(startDateP);
    dropdownDiv.appendChild(endDateP); */

  dropdownDiv.appendChild(titleP);
  dropdownDiv.appendChild(dropdownContentDiv);

  // Opret delete-knappen <div class="note-delete">
  const deleteBtnDiv = document.createElement("div");
  deleteBtnDiv.classList.add("note-delete");
  deleteBtnDiv.innerHTML = "X";

  // Tilføj en event listener til delete-knappen
  deleteBtnDiv.addEventListener("click", () => {
    deleteNoteHandler(index);
  });

  // Tilføj dropdown-containeren og delete-knappen til hovedelementet
  dropdownDiv.appendChild(deleteBtnDiv);
  noteDiv.appendChild(dropdownDiv);

  return noteDiv;
}

// const index = 0; // Dette skal være det aktuelle index for noten
// const noteElement = createNoteElement(note, index);
// noteContainer.appendChild(noteElement);
