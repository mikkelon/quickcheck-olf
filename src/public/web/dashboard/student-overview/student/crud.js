// crud.js
import {
  createAgreement,
  deleteAgreementById,
  getAgreementsByStudentId,
} from "../../../../utility/datahandler.js";

// Sample data (in-memory storage)
let parentsData = [];
let agreements = [];

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

async function getAgreementByStudentId(studentId) {
  agreements = await getAgreementsByStudentId(studentId);
  return agreements;
}

async function createNewAgreement(studentId, message, daysValid) {
  const agreement = {
    message,
    daysValid,
  };

  await createAgreement(studentId, agreement);

  agreements.push(agreement);
  return agreement;
}

//Function to delete agreement by index
function deleteAgreement(index) {
  const deletedAgreement = agreements.splice(index, 1);
  const agreementId = agreements[0].id;
  deleteAgreementById(agreementId);

  return deletedAgreement[0];
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
  createNewAgreement,
  deleteAgreement,
  getAgreementByStudentId,
};
