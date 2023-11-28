// crud.js
import { createFamily } from "../../../../utility/datahandler.js";

// Sample data (in-memory storage)
let parentsData = [];
let childrenData = [];

// Function to create a new parent
function createParent(name, phone, email, relation) {
  const newParent = { name, phone, email, relation };
  parentsData.push(newParent);
  return newParent;
}

async function submitToDatabase() {
  console.log("submitting to database");
  console.log(childrenData, parentsData);

  try {
    await createFamily(childrenData, parentsData);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Function to create a new child
function createChild(name, classId, birthday) {
  const newChild = { name, classId, birthday };
  childrenData.push(newChild);
  return newChild;
}

// Function to read all parents
function getAllParents() {
  return parentsData;
}

// Function to read all children
function getAllChildren() {
  return childrenData;
}

// Function to update parent by index
function updateParent(index, field, newData) {
  parentsData[index][field] = newData;
  return parentsData[index];
}

// Function to update child by index
function updateChild(index, field, newData) {
  childrenData[index][field] = newData;
  return childrenData[index];
}

// Function to delete parent by index
function deleteParent(index) {
  const deletedParent = parentsData.splice(index, 1);
  return deletedParent[0];
}

// Function to delete child by index
function deleteChild(index) {
  const deletedChild = childrenData.splice(index, 1);
  return deletedChild[0];
}

function clear() {
  parentsData = [];
  childrenData = [];
  createChild("", "", "");
  createParent("", "", "", "");
}

export {
  createParent,
  createChild,
  getAllParents,
  getAllChildren,
  updateParent,
  updateChild,
  deleteParent,
  deleteChild,
  submitToDatabase,
  clear,
};
