const createBtn = document.getElementById('createBtn');
const parentsContainer = document.getElementById('other-parents');

var parentsFile = 'components/parent.html';
var createBtnFile = 'components/createButton.html';

createBtn.addEventListener('click', () => {
    loadNewParent();
});

function loadNewParent() {
    fetch(parentsContainer).then(function (response) {
        console.log(response);
        return response.text();
    }).then(function (html) {
        document.querySelector("parentForms").innerHTML = html;
    });

    fetch(createBtnFile).then(function (response) {
        return response.text();
    }).then(function (html) {
        document.querySelector("createBtn").innerHTML = html;
    });
}

loadNewParent();