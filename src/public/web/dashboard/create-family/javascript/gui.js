// gui.js

import {
  createParent,
  createChild,
  getAllParents,
  getAllChildren,
  updateParent,
  updateChild,
  deleteParent,
  deleteChild,
  submitToDatabase,
  clear,
} from "./crud.js";
import { getClasses } from "../../../../utility/datahandler.js";
import config from "../../../../utility/config.js";

// Fetch options for the class dropdown from an API
let classOptions;

const createDeleteButton = () => {
  const deleteButton = document.createElement("div");
  deleteButton.classList.add("delete");
  deleteButton.style.backgroundImage = `url(${config.assets.icons.closeBold})`;

  return deleteButton;
};

// Function to display parents on the UI
function displayParents() {
  const parentsContainer = document.getElementById("parents");
  parentsContainer.innerHTML = "";

  const parents = getAllParents();

  parents.forEach((parent, index) => {
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
      createParent("", "", "", "");
      displayParents();
    }
  );

  parentsContainer.appendChild(parentButton);
}

// Function to display children on the UI
function displayChildren() {
  const childrenContainer = document.getElementById("children");
  childrenContainer.innerHTML = "";

  const children = getAllChildren();

  children.forEach((child, index) => {
    const childDiv = createChildElement(child, index);
    childrenContainer.appendChild(childDiv);
  });

  const createButton = createAddButton("createChild", "Tilføj Barn", () => {
    // Handle the click event for adding a parent
    // You can show a form or perform any other action
    console.log("Add Children button clicked");
    createChild("", "", "");
    displayChildren();
  });

  childrenContainer.appendChild(createButton);
}

// Function to create a parent element
function createParentElement(parent, index) {
  const parentDiv = document.createElement("div");
  parentDiv.classList.add("container");

  const headerDiv = document.createElement("div");
  headerDiv.classList.add("container-header");
  headerDiv.innerHTML = `<h2>Forælder</h2>`;

  headerDiv.appendChild(createDeleteButton());

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

  const relationForm = createFormElement(
    "Relation (f.eks. Mor)",
    "text",
    "relation",
    parent.relation
  );
  formsContainer.appendChild(relationForm);

  const nameInput = nameForm.querySelector(".forms-input");
  const phoneInput = phoneForm.querySelector(".forms-input");
  const emailInput = emailForm.querySelector(".forms-input");
  const relationInput = relationForm.querySelector(".forms-input");

  nameInput.addEventListener("blur", () =>
    updateParentData(index, "name", nameInput.value)
  );
  phoneInput.addEventListener("blur", () =>
    updateParentData(index, "phone", phoneInput.value)
  );
  emailInput.addEventListener("blur", () =>
    updateParentData(index, "email", emailInput.value)
  );
  emailInput.addEventListener("blur", () =>
    updateParentData(index, "relation", relationInput.value)
  );

  parentDiv.appendChild(headerDiv);
  parentDiv.appendChild(formsContainer);

  return parentDiv;
}

// ...

// Function to create a child element
function createChildElement(child, index) {
  const childDiv = document.createElement("div");
  childDiv.classList.add("container");

  const headerDiv = document.createElement("div");
  headerDiv.classList.add("container-header");
  headerDiv.innerHTML = `<h2>Barn</h2>`;

  headerDiv.appendChild(createDeleteButton());

  headerDiv
    .querySelector(".delete")
    .addEventListener("click", () => deleteChildHandler(index));

  const formsContainer = document.createElement("div");
  formsContainer.classList.add("forms-container");

  const nameForm = createFormElement("Fulde navn", "text", "name", child.name);
  formsContainer.appendChild(nameForm);

  const classForm = createDropdownFormElement(
    "Klasse",
    "classId",
    classOptions,
    child.classId
  );
  formsContainer.appendChild(classForm);

  const birthdayForm = createFormElement(
    "Fødselsdag",
    "date",
    "birthday",
    child.birthday
  );
  formsContainer.appendChild(birthdayForm);

  const nameInput = nameForm.querySelector(".forms-input");
  const classInput = classForm.querySelector(".forms-input");
  const birthdayInput = birthdayForm.querySelector(".forms-input");

  nameInput.addEventListener("blur", () =>
    updateChildData(index, "name", nameInput.value)
  );
  classInput.addEventListener("blur", () => {
    const selectedIndex = classInput.selectedIndex;
    const selectedOption = classInput.options[selectedIndex];
    updateChildData(
      index,
      "classId",
      selectedOption?.getAttribute("data-class-id")
    );
  });
  birthdayInput.addEventListener("blur", () => {
    const newBirthday = event.target.value;
    updateChildData(index, "birthday", newBirthday);
  });

  childDiv.appendChild(headerDiv);
  childDiv.appendChild(formsContainer);

  return childDiv;
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

// ...

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

// Event handler for deleting a parent
function deleteParentHandler(index) {
  const deletedParent = deleteParent(index);
  console.log("Deleted Parent:", deletedParent);

  // Update the UI
  displayParents();
}

// Event handler for deleting a child
function deleteChildHandler(index) {
  const deletedChild = deleteChild(index);
  console.log("Deleted Child:", deletedChild);

  // Update the UI
  displayChildren();
}

// Function to update parent data
function updateParentData(index, field, value) {
  const updatedParent = updateParent(index, field, value);
  console.log("Updated Parent:", updatedParent);
}

// Function to update child data
function updateChildData(index, field, value) {
  const updatedChild = updateChild(index, field, value);
  console.log("Updated Child:", updatedChild);
}

function forælderOprettet(success) {
  const informationContainer = document.getElementById("information");
  // scroll to top
  window.scrollTo(0, 0);
  // setTimeout(() => {
  //   window.location.href = './index.html';
  // }, 1500);

  if (success) {
    informationContainer.innerHTML = `<p>Familie oprettet</p>`;
    informationContainer.classList.add("success");
    clear();
    displayParents();
    displayChildren();
  } else {
    informationContainer.innerHTML = `<p>Kunne ikke oprette familie</p>`;
    informationContainer.classList.add("error");
  }
}

// Function to initialize the GUI
async function initGUI() {
  getClasses()
    .then((data) => {
      classOptions = data;
    })
    .then(() => {
      // Example: Display parents and children on page load
      displayParents();
      displayChildren();
    });

  const submit = document.getElementById("submit");
  submit.addEventListener("click", async () => {
    const success = await submitToDatabase();
    console.log("Success:", success);
    forælderOprettet(success);
  });

  const cancel = document.getElementById("cancel");
  cancel.addEventListener("click", () => {
    // Clear all data
    clear();
  });
}

// Initialize the GUI when the DOM is ready
document.addEventListener("DOMContentLoaded", initGUI);

const cancel = document.getElementById("cancel");
cancel.addEventListener("click", () => {
  window.location.href = "./index.html";
});
