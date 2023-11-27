import {
  getDocs,
  collection,
  doc,
  getDoc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../config/firebase.js";

const getClasses = async () => {
  const classesDocs = await getDocs(collection(db, "classes"));
  const classes = classesDocs.docs.map(doc => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return classes;
};

const getClassById = async id => {
  const docRef = doc(db, "classes", id);
  const docSnap = await getDoc(docRef);
  const clazz = docSnap.data();
  return clazz;
};

const getStudentsByClassId = async classId => {
  const firebaseQuery = query(
    collection(db, "students"),
    where("classId", "==", classId)
  );
  const studentsDocs = await getDocs(firebaseQuery);
  const students = studentsDocs.docs.map(doc => {
    return { id: doc.id, ...doc.data() };
  });
  return students;
};

export { getClasses, getClassById, getStudentsByClassId };
