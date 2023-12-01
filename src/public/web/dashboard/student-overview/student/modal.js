import { getStudents } from "../../../../datahandler.js";

let child;

async function initGUI() {
    child = await getStudents().then((students) => {
        return students[0];
    })

    console.log(child);
}

document.addEventListener("DOMContentLoaded", initGUI);

const goBack = document.getElementById("back-icon");
goBack.addEventListener("click", () => {
    window.location.href = "../../dashboard/index.html";
});

var modal = document.getElementById('note-modal');

// Function to open the modal
function openModal() {
  modal.style.display = 'block';
  // Attach click event listener to the document
  document.addEventListener('click', outsideClick);
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
  // Remove the click event listener from the document
  document.removeEventListener('click', outsideClick);
}

// Function to handle clicks outside the modal
function outsideClick(e) {
  if (e.target !== modal && !modal.contains(e.target)) {
    closeModal();
  }
}


















