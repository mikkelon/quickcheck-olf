import { adminAuth, adminDB } from "../../config/firebase-admin.js";

const createAgreement = async agreement => {
  try {
    const docRef = await adminDB.collection("agreements").add(agreement);
    console.log("Agreement created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(error);
    throw new Error("Fejl ved oprettelse af agreement");
  }
};

const getAgreementByStudentId = async studentId => {
  const agreementsSnapshot = await adminDB
    .collection("agreements")
    .where("studentId", "==", studentId)
    .get();
  const agreements = agreementsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(agreements);
  return agreements;
};

const deleteAgreement = async agreementId => {
  await adminDB.collection("agreements").doc(agreementId).delete();
};

const getDailyAgreements = async () => {
  const agreementsSnapshot = await adminDB
    .collection("agreements")
    .where("daysValid", "array-contains", new Date().getDay())
    .get();
  const agreements = agreementsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const studentsSnapshot = await adminDB.collection("students").get();
  const students = studentsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  const classesSnapshot = await adminDB.collection("classes").get();
  const classes = classesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  agreements.forEach(agreement => {
    const student = students.find(student => student.id == agreement.studentId);
    const clazz = classes.find(clazz => clazz.id == student.classId);
    agreement.student = student;
    student.class = clazz;
  });

  return agreements;
};

export {
  getDailyAgreements,
  createAgreement,
  getAgreementByStudentId,
  deleteAgreement,
};
