import { db } from "../../public/utility/firebase.js";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";

const getParents = async () => {
  const parentsDocs = await getDocs(collection(db, "parents"));
  const parents = parentsDocs.docs.map(doc => {
    return { id: doc.id, ...doc.data() };
  });

  return parents;
};

const getParentById = async id => {
  const docRef = doc(db, "parents", id);
  const docSnap = await getDoc(docRef);
  const parent = { id: docSnap.id, ...docSnap.data() };
  return parent;
};

const getStudentsByParentsId = async parentsId => {
  const firebaseQuery = query(
    collection(db, "students"),
    where("parentsId", "==", parentsId)
  );
  const studentsDocs = await getDocs(firebaseQuery);
  const students = studentsDocs.docs.map(doc => ({
    id: doc.id, // Include the student ID
    ...doc.data(),
  }));
  console.log(students);
  return students;
};

const deleteParents = async parentsId => {
  const docRef = doc(db, "parents", parentsId);
  await deleteDoc(docRef);
};

const updateParents = async (parentsId, updatedParents) => {
  const docRef = doc(db, "parents", parentsId);
  await updateDoc(docRef, updatedParents);
};

const addParent = async (parentsId, newParent) => {
  const docRef = doc(db, "parents", parentsId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Fejl - forælder findes ikke");
  }

  const parents = docSnap.data().parents;
  parents.push(newParent);
  await updateDoc(docRef, { parents });
};

export {
  getParents,
  getParentById,
  getStudentsByParentsId,
  deleteParents,
  updateParents,
  addParent,
};
