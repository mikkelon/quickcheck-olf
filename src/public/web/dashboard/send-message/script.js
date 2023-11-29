import { writeNotice } from "../../../utility/realtime.js";
// import data from "./data.json";

const childrenData = [
    { id: 'child1', name: 'Barn 1', value: 'child1' },
    { id: 'child2', name: 'Barn 2', value: 'child2' },
    { id: 'child3', name: 'Barn 3', value: 'child3' },
];

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

            createMessageObject(message, selectedChildren, sendDate);
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

function createMessageObject(message, selectedChildren, sendDate,) {
    const data = {
        "sendDate": "2021-05-12",
        "sender": {
            "name": "Browly",
            "relation": "Far"
        },
        "concerns": [
            {
                "name": "Kuririn",
                "class": "Pink"
            }
        ],
        "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl quis aliquam ultricies, nunc"
    };

    console.log(data.concerns);

    // Sørg for at sende alle nødvendige parametre
    writeNotice(data.sender, data.concerns, data.message, data.sendDate);
}

createMessageObject();

function getChildren() {
    return childrenData;
}

async function createChildrenGui() {
    const children = getChildren();

    // Få fat i det overordnede container-element
    const childrenContainer = document.getElementById('children');

    children.forEach(child => {
        const childContainer = document.createElement('div');
        childContainer.classList.add('child-container'); // Tilføjet ny klasse for styling (valgfrit)

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = child.id;
        checkbox.name = 'child';
        checkbox.value = child.value;

        const label = document.createElement('label');
        label.classList.add('label-child');
        label.htmlFor = child.id;
        label.textContent = child.name;

        childContainer.appendChild(checkbox);
        childContainer.appendChild(label);

        childrenContainer.appendChild(childContainer);
    });
}



