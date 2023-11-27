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

const createSessionCookie = async (idToken) => {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });
  const options = {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,
  };

  return { sessionCookie, options };
};

export { createUser, createSessionCookie };
