// crud.js
import { createParents } from "../../datahandler.js";

// Sample data (in-memory storage)
let parentsData = [];
let childrenData = [];

// Function to create a new parent
function createParent(name, phone, email) {
    const newParent = { name, phone, email };
    parentsData.push(newParent);
    return newParent;
}

function submitToDatabase() {
    createParents(parentsData, childrenData);
}

// Function to create a new child
function createChild(name, grade, birthday) {
    const newChild = { name, grade, birthday };
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

export {
    createParent,
    createChild,
    getAllParents,
    getAllChildren,
    updateParent,
    updateChild,
    deleteParent,
    deleteChild,
    submitToDatabase
};
