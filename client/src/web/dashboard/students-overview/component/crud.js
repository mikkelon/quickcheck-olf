// crud.js
import { createStudentsAndParents } from "../../../../datahandler.js";

// Sample data (in-memory storage)
let parentsData = [];
let notes = [];

// Function to create a new parent
function createParent(name, phone, email) {
  const newParent = { name, phone, email };
  parentsData.push(newParent);
  return newParent;
}

// Function to read all parents
function getAllParents() {
  return parentsData;

}

function getAllNotes() {
  return notes;
}

function createNewNote(title, description, startDate, endDate) {
  const note = {
    title,
    description,
    startDate,
    endDate,
  }

  notes.push(note);
  return note;
}

//Function to delete note by index
function deleteNote(index) {
  const deletedNote = notes.splice(index, 1);
  return deletedNote[0];
}

// Function to update parent by index
function updateParent(index, field, newData) {
  parentsData[index][field] = newData;
  return parentsData[index];
}

// Function to delete parent by index
function deleteParent(index) {
  const deletedParent = parentsData.splice(index, 1);
  return deletedParent[0];
}

function clear() {
  parentsData = [];
  createParent("", "", "");
}

export {
  createParent,
  getAllParents,
  updateParent,
  deleteParent,
  clear,
  createNewNote,
  getAllNotes,
  deleteNote
};
