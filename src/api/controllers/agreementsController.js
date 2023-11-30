import { adminAuth, adminDB } from "../../config/firebase-admin.js";
import { query, collection, where, getDocs } from "firebase/firestore";

const createAgreement = async (agreement) => {
  try {
    const docRef = await adminDB.collection("agreements").add(agreement);
    console.log("Agreement created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(error);
    throw new Error("Fejl ved oprettelse af agreement");
  }
};

const getAgreementByStudentId = async (studentId) => {
  const agreementsSnapshot = await adminDB
    .collection("agreements")
    .where("studentId", "==", studentId)
    .get();
  const agreements = agreementsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(agreements);
  return agreements;
};

const deleteAgreement = async (agreementId) => {
  await adminDB.collection("agreements").doc(agreementId).delete();
};

export { createAgreement, getAgreementByStudentId, deleteAgreement };
