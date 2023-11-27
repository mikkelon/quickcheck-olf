import { adminDB } from "../../config/firebase-admin.js";
import { getDocs, collection, getDoc, query, where } from "firebase/firestore";

const getClasses = async () => {
  const classesSnapshot = await adminDB.collection("classes").get();
  const classes = classesSnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return classes;
};

const getClassById = async (id) => {
  const docRef = adminDB.collection("classes").doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    return null; // Or handle appropriately if the document does not exist
  }
  return { id: docSnap.id, ...docSnap.data() };
};

const getStudentsByClassId = async (classId) => {
  const studentsSnapshot = await adminDB
    .collection("students")
    .where("classId", "==", classId)
    .get();
  const students = studentsSnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return students;
};

export { getClasses, getClassById, getStudentsByClassId };
