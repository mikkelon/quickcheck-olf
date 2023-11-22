import express from "express";
import { adminAuth, adminDB } from "../firebase-admin.js";
const router = express.Router();

/**
 * Route for signing up a new parent user.
 * POST body should contain:
 * - email
 * - parentId
 */
router.post("/parent", (req, res) => {
  const { email, parentId } = req.body;
  console.log("Creating user:", email, parentId);

  adminAuth
    .createUser({
      email,
      password: "password",
    })
    .then((userRecord) => {
      console.log("Successfully created new user:", userRecord.uid);
      // Update parent in parents collection
      const parentRef = adminDB.collection("parents").doc(parentId);

      parentRef.update({
        uid: userRecord.uid,
      });

      res.status(200).send({
        message: "Successfully created new user",
        data: {
          uid: userRecord.uid,
        },
      });
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
      res.status(500).send({
        message: "Error creating new user",
        data: {
          error,
        },
      });
    });
});

router.post("/employee", (req, res) => {
  const { email, password } = req.body;
  adminAuth
    .createUser({
      email,
      password,
    })
    .then((userRecord) => {
      console.log("Successfully created new user:", userRecord.uid);
      res.status(200).send({
        message: "Successfully created new user",
        data: {
          uid: userRecord.uid,
        },
      });
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
      res.status(500).send({
        message: "Error creating new user",
        data: {
          error,
        },
      });
    });
});
export default router;
