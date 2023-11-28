import { adminDB } from "../../config/firebase-admin.js";

const getParents = async () => {
  const parentsSnapshot = await adminDB.collection("parents").get();
  const parents = parentsSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return parents;
};

const getParentById = async (id) => {
  const docRef = adminDB.collection("parents").doc(id);
  const docSnap = await docRef.get();
  const parent = { id: docSnap.id, ...docSnap.data() };
  return parent;
};

const getStudentsByParentsId = async (parentsId) => {
  const studentsSnapshot = adminDB
    .collection("students")
    .where("parentsId", "==", parentsId)
    .get();
  const students = studentsSnapshot.docs.map((doc) => ({
    id: doc.id, // Include the student ID
    ...doc.data(),
  }));
  console.log(students);
  return students;
};

const deleteParents = async (parentsId) => {
  await adminDB.collection("parents").doc(parentsId).delete();
};

const updateParents = async (parentsId, updatedParents) => {
  await adminDB.collection("parents").doc(parentsId).update(updatedParents);
};

const addParent = async (parentsId, newParent) => {
  const docRef = adminDB.collection("parents").doc(parentsId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error("Fejl - forælder findes ikke");
  }

  const parents = docSnap.data().parents;
  parents.push(newParent);
  await adminDB.collection("parents").doc(parentsId).update({ parents });
};

export {
  getParents,
  getParentById,
  getStudentsByParentsId,
  deleteParents,
  updateParents,
  addParent,
};
