import express from "express";
import { adminAuth, adminDB } from "../../config/firebase-admin.js";
const router = express.Router();

/**
 * Create a new parents user in firebase
 * @param {string} email The email
 * @param {string} parentsId The parents id
 * @returns {Promise} A promise that resolves with the new user's data
 */
export const createParentUserWithEmailAndId = async (email, parentsId) => {
  if (!email || !parentsId) {
    throw new Error("Fejl - manglende data");
  }

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password: "123456", // TODO: Generate random password and send email to user
    });

    console.log("Successfully created new user:", userRecord.uid);

    // Add new document to users collection
    await adminDB.collection("users").doc(userRecord.uid).set({
      parentsId,
      role: "parents",
    });

    return userRecord;
  } catch (error) {
    console.log("Error creating new user:", error);
    throw error; // This will allow the caller to catch the error
  }
};

router.post("/employee", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    console.log("Successfully created new user:", userRecord.uid);
    res.status(200).send({
      message: "Successfully created new user",
      data: {
        uid: userRecord.uid,
      },
    });
  } catch (error) {
    console.error("Error creating new user:", error);
    res.status(500).send({
      message: "Error creating new user",
      data: {
        error: error.message, // Sending only the error message for better client-side handling
      },
    });
  }
});

export default router;
