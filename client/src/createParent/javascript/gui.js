import { addParent, parents } from "./app.js";

//const createBtnContainer = document.getElementById("createBtn");
const parentsContainer = document.getElementById("parents");
const childrenContainer = document.getElementById("children");

// Components
var parentsFile = "components/parent.html";
var childrenFile = "components/child.html";

var createParentButtonFile = "components/createParentButton.html";
var createChildButtonFile = "components/createChildButton.html";

var childForms = 1;

const parser = new DOMParser();

function loadParents() {
  parentsContainer.innerHTML = "";

  fetch(parentsFile)
    .then((response) => response.text())
    .then(function (html) {
      for (let i = 0; i < (parents + 1); i++) {
        const parentElement = document.createElement("div");
        parentElement.classList.add("parent");
        parentElement.innerHTML = html;

        // Add an ID to each parent
        // const parentId = `${createButtonId}-${i + 1}`;
        parentElement.id = `parent-${i + 1}`;

        parentsContainer.appendChild(parentElement);
      }
    });

  fetch(createParentButtonFile)
    .then((response) => response.text())
    .then(function (htmlString) {
      const html = parser.parseFromString(htmlString, 'text/html');
      createCreateBtn(html, parentsContainer, "createParent", () => {
        createParent(htmlString);
        loadParents();
      });
    });
}

function createParent(html) {
  const id = html.parent.getElementById("id").value;

  const name = html.getElementById("name").value;
  const phone = html.getElementById("phone").value;
  const email = html.getElementById("email").value;

  const parent = {
    id: id,
    name: name,
    phone: phone,
    email: email,
  };

  addParent(parent);
}

function createCreateBtn(html, containerNode, id, onClick) {
  containerNode.innerHTML += html;

  console.log(containerNode.innerHTML);

  const createBtn = document.getElementById(id);

  createBtn.addEventListener("click", onClick);
}

function removeParent(parent) {
  parent.remove();
  parentForms--;
}

function loadChildren() {
  childrenContainer.innerHTML = "";

  fetch(childrenFile)
    .then((response) => response.text())
    .then(function (html) {
      for (let i = 0; i < childForms; i++) {
        const parentElement = document.createElement("div");
        parentElement.classList.add("child");
        parentElement.innerHTML = html;

        // Add an ID to each parent
        // const parentId = `${createButtonId}-${i + 1}`;
        parentElement.id = `child-${i + 1}`;

        childrenContainer.appendChild(parentElement);
      }
    });

  fetch(createChildButtonFile)
    .then((response) => response.text())
    .then(function (html) {
      createCreateBtn(html, childrenContainer, "createChild", () => {
        loadChildren();
        childForms++;
      });
    });
}

loadParents();
loadChildren();
