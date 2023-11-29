import { adminAuth, adminDB } from "../../config/firebase-admin.js";

const createUser = async (email, password, role) => {
  const userRecord = await adminAuth.createUser({
    email,
    password,
  });

  await adminDB.collection("users").doc(userRecord.uid).set({
    role: role,
  });

  // Set custom user claims
  adminAuth.setCustomUserClaims(userRecord.uid, { role });

  console.log("Successfully created new user:", userRecord.uid);

  return userRecord;
};

const createSessionCookie = async (idToken) => {
  const decodedIdToken = await adminAuth.verifyIdToken(idToken);

  const userId = decodedIdToken.uid;
  const user = await adminDB.collection("users").doc(userId).get();
  const role = user.data().role;

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  adminAuth.setCustomUserClaims(userId, { role });
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
