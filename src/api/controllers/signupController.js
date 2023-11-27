import { adminAuth, adminDB } from "../../config/firebase-admin.js";

const createEmployeeUser = async (email, password) => {
  const userRecord = await adminAuth.createUser({
    email,
    password,
  });
  return userRecord;
};

export { createEmployeeUser };
