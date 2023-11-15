//const createBtnContainer = document.getElementById("createBtn");
const parentsContainer = document.getElementById("parents");
const childrenContainer = document.getElementById("children");

var parentsFile = "components/parent.html";
var createParentButtonFile = "components/createParentButton.html";
var createChildButtonFile = "components/createChildButton.html";

var childrenFile = "components/child.html";

var parentForms = 1;
var childForms = 0;

function loadParents() {
  parentsContainer.innerHTML = "";

  fetch(parentsFile)
    .then((response) => response.text())
    .then(function (html) {
      for (let i = 0; i < parentForms; i++) {
        parentsContainer.innerHTML += html;
      }
    });

  fetch(createParentButtonFile)
    .then((response) => response.text())
    .then(function (html) {
      createCreateBtn(html, parentsContainer, "createParent", () => {
        loadParents();
        parentForms++;

      });
    });
}

function createCreateBtn(html, containerNode, id, onClick) {
  containerNode.innerHTML += html;

  const createBtn = document.getElementById(id);

  createBtn.addEventListener("click", onClick);
}

function loadChildren() {
  childrenContainer.innerHTML = "";

  fetch(childrenFile)
    .then((response) => response.text())
    .then(function (html) {
      for (let i = 0; i < childForms; i++) {
        childrenContainer.innerHTML += html;
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
