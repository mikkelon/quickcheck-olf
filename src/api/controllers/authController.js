import { adminAuth, adminDB } from "../../config/firebase-admin.js";

const createUser = async (email, password) => {
  const userRecord = await adminAuth.createUser({
    email,
    password,
  });

  await adminDB.collection("users").doc(userRecord.uid).set({
    role: "employee",
  });

  console.log("Successfully created new user:", userRecord.uid);

  return userRecord;
};

const logIn = async (email, password) => {};

export { createUser, logIn };
