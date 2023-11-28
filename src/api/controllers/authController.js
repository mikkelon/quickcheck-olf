import { adminAuth, adminDB } from "../../config/firebase-admin.js";

const createUser = async (email, password) => {
  const userRecord = await adminAuth.createUser({
    email,
    password,
  });
  return userRecord;
};

export { createUser };
