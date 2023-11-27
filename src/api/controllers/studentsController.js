import { adminDB } from "../../config/firebase-admin.js";
import {
  getDocs,
  collection,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const getStudents = async () => {
  const studentsSnapshot = await adminDB.collection("students").get();
  const students = studentsSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return students;
};

const getStudentById = async (id) => {
  const docRef = adminDB.collection("students").doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    throw new Error("Fejl - eleven findes ikke.");
  }

  const student = { id: docSnap.id, ...docSnap.data() };

  return student;
};

const deleteStudent = async (id) => {
  await adminDB.collection("students").doc(id).delete();
};

const updateStudent = async (id, updatedStudent) => {
  await adminDB.collection("students").doc(id).update(updatedStudent);
};

const toggleCheckedInStatus = async (id) => {
  const studentDoc = adminDB.collection("students").doc(id);
  const studentSnapshot = await studentDoc.get();

  if (!studentSnapshot.exists) {
    throw new Error("Fejl - eleven findes ikke.");
  }

  const currentCheckedInStatus = studentSnapshot.data().checkedIn;
  console.log(currentCheckedInStatus);
  const updatedCheckedInStatus = !currentCheckedInStatus;
  await adminDB
    .collection("students")
    .doc(id)
    .update({ checkedIn: updatedCheckedInStatus });
};

export {
  getStudents,
  getStudentById,
  deleteStudent,
  updateStudent,
  toggleCheckedInStatus,
};
