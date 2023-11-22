import { getParentsById } from "../../../../datahandler.js";
import { createParent, deleteParent, getAllParents } from "./crud.js";
import { createFormElement, createFormsContainer, createIconButton, createTextButton } from "../../../../forms.js";

const checkMark = "/client/assets/icons/check.svg";
const crossMark = "/client/assets/icons/cross.svg";

let editing = false;

const child = {
    "checkedIn": false,
    "name": "Mads Jensen",
    "parentsId": "jqzQiXeNiOcZMdZcTNwN",
    "birthday": "2005-02-15",
    "classId": "0777Ja1ckgt5F6XcaxZR",
    "class": {
        "id": "0777Ja1ckgt5F6XcaxZR",
        "class": 2,
        "colorLabel": "Rød",
        "color": "#FF4D4D"
    }
};

async function initGUI() {
    // const objStr = localStorage.getItem("child");
    // child = JSON.parse(objStr);
    const avatar = document.getElementById("avatar");
    const nameHeader = document.getElementById("name-header");
    const birthdayElement = document.getElementById("birthday");
    const clazzElement = document.getElementById("class");

    nameHeader.innerHTML = child.name;

    birthdayElement.value = child.birthday;
    clazzElement.value = child.class.colorLabel;

    setStatus(child.checkedIn);

    await getParentsById(child.parentsId).then((res) => {
        res.parents.map((parent) => {
            createParent(parent.name, parent.phone, parent.email);
        });
    });

    setParents();
    setState(false);

    const closeBtn = document.getElementById("closeBtn")
    closeBtn.addEventListener("click", () => {
        noteModal.style.display = "none";
    });
}

function addButtons() {
    const customizeButtons = document.getElementById("header-right");
    customizeButtons.innerHTML = "";

    if (editing) {
        const saveBtn = createTextButton("save", "Gem", () => {
            editing = !editing;
            setState(editing);
        });

        const cancelbtn = createTextButton("cancel", "Annuller", () => {
            editing = !editing;
            setState(editing);
        });

        customizeButtons.appendChild(cancelbtn);
        customizeButtons.appendChild(saveBtn);
    } else {
        const deleteBtn = createTextButton("delete", "Slet", () => {
            console.log("Delete button clicked");
        });

        const editBtn = createTextButton("edit", "Rediger", () => {
            editing = !editing;
            setState(editing);
        });

        customizeButtons.appendChild(deleteBtn);
        customizeButtons.appendChild(editBtn);
    }
}

function setState(editing) {
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
        const deleteIcon = createIconButton("delete", "<i class='fas fa-trash'></i>", () => {
            deleteParentHandler(index);
        });
        headerDiv.appendChild(deleteIcon);
    }

    const nameForm = createFormElement("Fulde navn", "text", "name", parent.name, () => {
        updateParentData(index, "name", nameInput.value);
    });

    const phoneForm = createFormElement("Telefonnummer", "text", "phone", parent.phone, () => {
        updateParentData(index, "phone", phoneInput.value);
    }
    );

    const emailForm = createFormElement("E-mail", "text", "email", parent.email, () => {
        updateParentData(index, "email", emailInput.value);
    });

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

const goBack = document.getElementById("back-icon");
goBack.addEventListener("click", () => {
    window.location.href = "../index.html";
});

const checkInOutBtn = document.getElementById("checkInOutBtn");
checkInOutBtn.addEventListener("click", () => {
    child.checkedIn = !child.checkedIn;
    setStatus(child.checkedIn);
});

const noteModal = document.getElementById("note-modal");

const addNote = document.querySelector(".add-note-btn");
addNote.addEventListener("click", () => {
    noteModal.style.display = "block";
});

document.addEventListener("DOMContentLoaded", initGUI);