import { adminDB, adminAuth } from "../../config/firebase-admin.js";

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
  const studentsSnapshot = await adminDB
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

const getParentsIdFromUserId = async (userId) => {
  const docRef = adminDB.collection("users").doc(userId);
  const docSnap = await docRef.get();
  const parentsId = docSnap.data().parentsId;
  return parentsId;
};

export const getStudentsBySessionCookie = async (sessionCookie) => {
  console.log("getting students by session cookie:", sessionCookie);
  const decodedClaims = await adminAuth.verifySessionCookie(
    sessionCookie,
    true // Check if revoked (extra cost but more secure)
  );
  const userId = decodedClaims.uid;

  const parentsId = await getParentsIdFromUserId(userId);

  const students = [];

  console.log("parentsId:", parentsId);
  console.log("userId:", userId);

  // Get students and their classes
  const studentsSnapshot = await adminDB
    .collection("students")
    .where("parentsId", "==", parentsId)
    .get();

  // Get classes
  const classesSnapshot = await adminDB.collection("classes").get();

  // Embed class data in students
  studentsSnapshot.docs.forEach((doc) => {
    const student = {
      id: doc.id,
      ...doc.data(),
    };
    const classId = student.classId;
    const classDoc = classesSnapshot.docs.find((doc) => doc.id === classId);
    const classData = classDoc.data();
    student.class = classData;
    students.push(student);
  });

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

export const getParentInfoBySessionCookie = async (sessionCookie) => {
  console.log("getting students by session cookie:", sessionCookie);
  const decodedClaims = await adminAuth.verifySessionCookie(
    sessionCookie,
    true // Check if revoked (extra cost but more secure)
  );
  const userId = decodedClaims.uid;

  const parentsId = await getParentsIdFromUserId(userId);

  const parents = await getParentById(parentsId);

  return parents;
};



export {
  getParents,
  getParentById,
  getStudentsByParentsId,
  deleteParents,
  updateParents,
  addParent,
};
