// crud.js
import {
  createAgreement,
  deleteAgreementById,
} from "../../../../utility/datahandler.js";

// Sample data (in-memory storage)
let parentsData = [];

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

function deleteAgreement(id) {
  deleteAgreementById(id);
}
function createNewAgreement(studentId, message, daysValid) {
  const agreement = {
    studentId: studentId,
    message: message,
    daysValid: daysValid,
  };
  createAgreement(studentId, agreement);
}

export {
  createParent,
  getAllParents,
  updateParent,
  deleteParent,
  clear,
  createNewAgreement,
  deleteAgreement,
};
