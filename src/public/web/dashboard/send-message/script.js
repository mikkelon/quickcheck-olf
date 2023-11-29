import { writeNotice } from "../../../utility/realtime.js";
// import data from "./data.json";
import { getParentInfoBySessionCookie, getStudentsBySessionCookie } from "../../../utility/datahandler.js";

let parents = null;

async function initGui() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    createChildrenGui();
}

document.addEventListener('DOMContentLoaded', initGui);

document.addEventListener('DOMContentLoaded', function () {
    const sendBtn = document.querySelector('.send-btn');
    const clearBtn = document.querySelector('.clear-btn');

    // 'Send'-knappen
    sendBtn.addEventListener('click', function (event) {
        event.preventDefault();
        const textArea = document.querySelector('.text-area');
        const childrenCheckboxes = document.querySelectorAll('.child-container input[type="checkbox"]');
        const sendDateInput = document.getElementById('sendDate');
        const sender = document.getElementById('parents-dropdown').value;

        const message = textArea.value;

        const selectedChildren = Array.from(childrenCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const sendDate = sendDateInput.value;

        const confirmation = window.confirm('Er du sikker på at du vil du sende beskeden?');

        if (confirmation) {
            console.log('Besked:', message);
            console.log('Markerede børn:', selectedChildren);
            console.log('Dato for afsendelse:', sendDate);

            const data = {
                "sendDate": sendDate,
                "sender": sender,
                "concerns": selectedChildren,
                "message": message
            };

            console.log(data);

            // Sørg for at sende alle nødvendige parametre
            writeNotice(data);
        }

        textArea.value = '';
        childrenCheckboxes.forEach(checkbox => (checkbox.checked = false));
        sendDateInput.value = '';
    });

    // 'Ryd'-knappen
    clearBtn.addEventListener('click', function () {
        const textArea = document.querySelector('.text-area');
        const childrenCheckboxes = document.querySelectorAll('.child-container input[type="checkbox"]');
        const sendDateInput = document.getElementById('sendDate');

        textArea.value = '';
        childrenCheckboxes.forEach(checkbox => (checkbox.checked = false));
        sendDateInput.value = '';
    });
});


function createMessageObject(message, selectedChildren, sendDate, sender) {

}

async function createChildrenGui() {
    const children = await getStudentsBySessionCookie();

    // Få fat i det overordnede container-element
    const childrenContainer = document.getElementById('children');

    children.forEach(child => {
        const childContainer = document.createElement('div');
        childContainer.classList.add('child-container'); // Tilføjet ny klasse for styling (valgfrit)

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = child.id;
        checkbox.name = 'child';
        checkbox.value = child.name;

        const label = document.createElement('label');
        label.classList.add('label-child');
        label.htmlFor = child.id;
        label.textContent = child.name;

        childContainer.appendChild(checkbox);
        childContainer.appendChild(label);

        childrenContainer.appendChild(childContainer);
    });

    const parentInfo = await getParentInfoBySessionCookie();
    parents = parentInfo.parents;

    const dropdown = document.getElementById('parents-dropdown');

    parents.forEach(parent => {
        dropdown.innerHTML += `
            <option value="${parent.name}">${parent.name}</option>
        `;
    });
}





