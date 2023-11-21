import { getStudents } from "../datahandler.js";

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

const noteModal = document.getElementById("note-modal");

const addNote = document.querySelector(".add-note-btn");
addNote.addEventListener("click", () => {
    noteModal.style.display = "block";
});

document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.getElementById("closeBtn")

    closeBtn.addEventListener("click", () => {
        noteModal.style.display = "none";
    });
});

















