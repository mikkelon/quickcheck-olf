const createBtnContainer = document.getElementById('createBtn');
const parentsContainer = document.getElementById('parents');

var parentsFile = 'components/parent.html';
var createBtnFile = 'components/createButton.html';

var forms = 1;

function loadParents() {
    parentsContainer.innerHTML = '';

    fetch(parentsFile).then((response) => response.text())
        .then(function (html) {
            for(let i = 0; i < forms; i++){
                parentsContainer.innerHTML += html;
            }
        });

    fetch(createBtnFile).then((response) => response.text())
        .then(function (html) {
            createCreateBtn(html);
        });
}

function createCreateBtn(html) {
    parentsContainer.innerHTML +=  html;

    const createBtn = document.getElementById('create');

    createBtn.addEventListener('click', () => {
        loadParents();
        forms++;

        if (forms == (4 - 1)) {
            createBtnContainer.innerHTML = '';
        }
    });
}

loadParents();

// fetch(parentsFile).then((response) => response.text())
//     .then(function (html) {
//         document.getElementById('parentForms').innerHTML += html;
//     });


// fetch(createBtnFile).then((response) => response.text())
//     .then(function (html) {
//         createCreateBtn(html);
//     });
