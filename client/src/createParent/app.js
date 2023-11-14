const createBtnContainer = document.getElementById('createBtn');
const parentsContainer = document.getElementById('other-parents');

var parentsFile = 'components/parent.html';
var createBtnFile = 'components/createButton.html';

function loadNewParent() {
    fetch(parentsFile).then((response) => response.text()).then(function (html) {
        parentsContainer.innerHTML += html;
    });

    fetch(createBtnFile).then((response) => response.text())
        .then(function (html) {
            createCreateBtn(html);
        });
}

function createCreateBtn(html) {
    createBtnContainer.innerHTML = html;

    const createBtn = document.getElementById('create');

    createBtn.addEventListener('click', () => {
        loadNewParent();
    });
}

fetch(parentsFile).then((response) => response.text())
    .then(function (html) {
        document.getElementById('parentForms').innerHTML += html;
    });


fetch(createBtnFile).then((response) => response.text())
    .then(function (html) {
        createCreateBtn(html);
    });
