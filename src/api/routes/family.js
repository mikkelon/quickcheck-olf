import express from "express";
import { createParents } from "./parents.js";
import { createStudentsWithParentsId } from "./students.js";
import { createParentUserWithEmailAndId } from "./signup.js";
import { adminAuth } from "../../config/firebase-admin.js";
import { db } from "../../config/firebase.js";
import { deleteDoc, doc } from "firebase/firestore";

const router = express.Router();

router.post("/create", async (req, res) => {
  console.log("create family request:", req.body);

  // Rough data validation
  if (!req.body) {
    throw new Error("Fejl - manglende data");
  } else if (!req.body.students || !req.body.parents) {
    throw new Error("Fejl - manglende data");
  }

  // Get data from HTTP request
  const students = req.body.students;
  const parents = req.body.parents;

  // Variables for cleanup if error
  const studentIds = [];
  let parentsId = "";
  let userId = "";

  try {
    // Create parents
    parentsId = await createParents(parents);

    // Create students
    await createStudentsWithParentsId(students, parentsId);

    // Create parent user
    const userRecord = await createParentUserWithEmailAndId(
      parents[0].email,
      parentsId
    );
    userId = userRecord.uid;

    // Send response back to client
    res.status(201).send({
      message: "Familie oprettet",
      data: {
        parentsId,
      },
    });
  } catch (error) {
    console.log(error.message);

    // #-- Cleanup if error --#
    // Delete parents, if created
    if (parentsId) {
      await deleteDoc(doc(db, "parents", parentsId));
      console.log("parents deleted");
    }

    // Delete students, if created
    if (studentIds.length > 0) {
      studentIds.forEach(async studentId => {
        await deleteDoc(doc(db, "students", studentId));
      });
      console.log("students deleted");
    }

    // Delete user, if created
    if (userId) {
      await adminAuth.deleteUser(userId);
      console.log("user deleted");
    }

    // Send error response back to client
    res.status(500).send({
      message: "Fejl ved oprettelse af familie",
      data: {
        error,
      },
    });
  }
});

export default router;
