import { createNote, getParentsById } from "../../../../datahandler.js";
import { createNewNote, createParent, deleteNote, deleteParent, getAllNotes } from "./crud.js";

let child;

const checkMark = "/client/assets/icons/check.svg";
const crossMark = "/client/assets/icons/cross.svg";

const avatar = document.getElementById("avatar");
const nameHeader = document.getElementById("name-header");
const birthday = document.getElementById("birthday");
const clazz = document.getElementById("class");

async function initGUI() {
    const objStr = localStorage.getItem("child");
    child = JSON.parse(objStr);

    console.log(child);

    nameHeader.innerHTML = child.name;
    birthday.value = child.birthday;
    clazz.value = child.class.colorLabel;

    setStatus(child.checkedIn);
    setParents();
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

    const parents = await getParentsById(child.parents);

    console.log(parents);
    parents.parents.forEach((parent, index) => {
        const parentDiv = createParentElement(parent, index);
        parentsContainer.appendChild(parentDiv);
    });

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

// Function to create a button for adding a parent or child
function createAddButton(id, text, clickHandler) {
    const addButton = document.createElement("div");
    addButton.id = id;
    addButton.classList.add("container", "createBtn");

    addButton.innerHTML = `
      <svg class ="add" width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
          d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
          fill="#56E87F" />
      <path fill-rule="evenodd" clip-rule="evenodd"
          d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
          fill="#56E87F" />
  </svg>
          <p>${text}</p>`;

    addButton.addEventListener("click", clickHandler);

    return addButton;
}

// Function to create a form element
function createFormElement(labelText, inputType, inputId, inputValue) {
    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");

    const label = document.createElement("label");
    label.classList.add("forms-label");
    label.textContent = labelText;

    const input = document.createElement("input");
    input.classList.add("forms-input");
    input.setAttribute("type", inputType);
    input.setAttribute("id", inputId);
    input.value = inputValue;

    formContainer.appendChild(label);
    formContainer.appendChild(input);

    return formContainer;
}

// Function to create a dropdown form element
function createDropdownFormElement(
    labelText,
    inputId,
    options,
    selectedClassId
) {
    console.log("Creating dropdown form element");
    console.log("Selected classID:", selectedClassId);

    const formContainer = document.createElement("div");
    formContainer.classList.add("form-container");

    const label = document.createElement("label");
    label.classList.add("forms-label");
    label.textContent = labelText;

    let select = document.createElement("select");
    select.classList.add("forms-input");
    select.setAttribute("id", inputId);

    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.colorLabel;
        optionElement.textContent = option.colorLabel;

        optionElement.setAttribute("data-class-id", option.id);

        select.appendChild(optionElement);
    });

    // Find index of option where data-class-id matches selectedClassId
    const selectedIndex = options.findIndex(
        (option) => option.id === selectedClassId
    );
    select.selectedIndex = selectedIndex;

    formContainer.appendChild(label);
    formContainer.appendChild(select);

    return formContainer;
}

// Function to create a parent element
function createParentElement(parent, index) {
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("container");

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("container-header");
    headerDiv.innerHTML = `<h2>Forælder</h2>
              <svg class="delete" width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M16 8L8 16M8.00001 8L16 16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="#FF5656" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>`;
    headerDiv
        .querySelector(".delete")
        .addEventListener("click", () => deleteParentHandler(index));

    const formsContainer = document.createElement("div");
    formsContainer.classList.add("forms-container");

    const nameForm = createFormElement("Fulde navn", "text", "name", parent.name);
    formsContainer.appendChild(nameForm);

    const phoneForm = createFormElement(
        "Telefonnummer",
        "text",
        "phone",
        parent.phone
    );
    formsContainer.appendChild(phoneForm);

    const emailForm = createFormElement("E-mail", "text", "email", parent.email);
    formsContainer.appendChild(emailForm);

    const nameInput = nameForm.querySelector(".forms-input");
    const phoneInput = phoneForm.querySelector(".forms-input");
    const emailInput = emailForm.querySelector(".forms-input");

    nameInput.addEventListener("blur", () =>
        updateParentData(index, "name", nameInput.value)
    );
    phoneInput.addEventListener("blur", () =>
        updateParentData(index, "phone", phoneInput.value)
    );
    emailInput.addEventListener("blur", () =>
        updateParentData(index, "email", emailInput.value)
    );

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

const goBack = document.getElementById("back-icon");
goBack.addEventListener("click", () => {
    window.location.href = "../index.html";
});

const checkInOutBtn = document.getElementById("checkInOutBtn");
checkInOutBtn.addEventListener("click", () => {
    child.checkedIn = !child.checkedIn;
    setStatus(child.checkedIn);
});

document.addEventListener("DOMContentLoaded", initGUI);


const noteModal = document.getElementById("note-modal");

const addNote = document.querySelector(".add-note-btn");
addNote.addEventListener("click", () => {
    noteModal.style.display = "block";
});

document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.getElementById("closeBtn")

    closeBtn.addEventListener("click", () => {
        noteModal.style.display = "none";
    });
});

const saveNote = document.querySelector(".note-save-btn");
saveNote.addEventListener("click", async () => {

    const titleField = document.getElementById("note-title")
    const title = titleField.value;

    const descriptionField = document.getElementById("note-description")
    const description = descriptionField.value;

    const startDateField = document.getElementById("start-date")
    const startDate = startDateField.value;

    const endDateField = document.getElementById("end-date")
    const endDate = endDateField.value;

    createNewNote(title, description, startDate, endDate);
    createNotesGui();

    titleField.value = "";
    descriptionField.value = "";
    startDateField.value = "";
    endDateField.value = "";

    noteModal.style.display = "none";

})


function createNotesGui() {
    const notes = getAllNotes();
    const noteContainer = document.getElementById("notes")

    noteContainer.innerHTML = "";


    notes.forEach((note, index) => {
        const noteElm = createNoteElement(note, index);
        noteContainer.appendChild(noteElm);
    })
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

    const startDateP = document.createElement("p");
    startDateP.innerHTML = note.startDate;

    const endDateP = document.createElement("p");
    endDateP.innerHTML = note.endDate;

    // Opret dropdown-indholdet <div class="dropdown-content">
    const dropdownContentDiv = document.createElement("div");
    dropdownContentDiv.classList.add("dropdown-content");

    // Opret <p>-element for beskrivelse
    const descriptionP = document.createElement("p");
    descriptionP.innerHTML = note.description;

    // Tilføj <p>-elementet til dropdown-indholdet
    dropdownContentDiv.appendChild(descriptionP);

    // Tilføj <p>-elementerne til dropdown-containeren
    dropdownDiv.appendChild(titleP);
    dropdownDiv.appendChild(startDateP);
    dropdownDiv.appendChild(endDateP);
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
    noteDiv.appendChild(dropdownDiv);
    noteDiv.appendChild(deleteBtnDiv);

    return noteDiv;
}

const index = 0; // Dette skal være det aktuelle index for noten
const noteElement = createNoteElement(note, index);
noteContainer.appendChild(noteElement);






