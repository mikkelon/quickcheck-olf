import { db } from "../../config/firebase.js";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
  writeBatch,
  DocumentReference,
} from "firebase/firestore";

const getStudents = async () => {
  const studentsDocs = await getDocs(collection(db, "students"));
  const students = studentsDocs.docs.map(doc => {
    return { id: doc.id, ...doc.data() };
  });
  return students;
};

const getStudentById = async id => {
  const docRef = doc(db, "students", req.params.id);
  const docSnap = await getDoc(docRef);

  let student;
  if (docSnap.exists()) {
    student = { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error("Fejl - eleven findes ikke.");
  }
  return student;
};

const deleteStudent = async id => {
  await deleteDoc(doc(db, "students", id));
};

const updateStudent = async (id, updatedStudent) => {
  await updateDoc(doc(db, "students", id), updatedStudent);
};

const toggleCheckedInStatus = async id => {
  const docRef = doc(db, "students", id);
  const studentDoc = await getDoc(docRef);

  if (!studentDoc.exists()) {
    throw new Error("Eleven findes ikke.");
  }
  const currentCheckedInStatus = studentDoc.data().checkedIn;
  const updatedCheckedInStatus = !currentCheckedInStatus;
  await updateDoc(docRef, { checkedIn: updatedCheckedInStatus });
};

export {
  getStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
  toggleCheckedInStatus,
};
