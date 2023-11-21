import express from "express";
import { db } from "../firebase.js";

import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  writeBatch,
  DocumentReference,
} from "firebase/firestore";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const studentsDocs = await getDocs(collection(db, "students"));
    const students = studentsDocs.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

/* Hent elever i en klasse */
// TODO: classId er ikke en attribut på student endnu
router.get("/:classId", async (req, res) => {
  const classId = req.params.classId;
  console.log(classId);
  try {
    const firebaseQuery = query(
      collection(db, "students"),
      where("classId", "==", classId)
    );
    const studentsDocs = await getDocs(firebaseQuery);
    const students = studentsDocs.docs.map((doc) => doc.data());
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(400).send("Fejl ved hentning af elever");
  }
});

/* Opret elev(er) */
/**
 * Takes an object containing an array of students and an array of parents
 * Adds the students and the parents to the database
 * Links the students to the parents and vice versa
 */
router.post("/", async (req, res) => {
  console.log(req.body);
  // Rough data validation
  if (!req.body) {
    throw new Error("Fejl - manglende data");
  } else if (!req.body.students || !req.body.parents) {
    throw new Error("Fejl - manglende data");
  }

  const students = req.body.students;
  const parents = req.body.parents;

  let transactionError = null; // Variable to hold error from transaction
  let parentDocId = null; // Variable to hold ID of parent object
  const studentIds = []; // Array to hold the IDs of the students - will be added to parent object later

  try {
    // Add children to database

    let batch = writeBatch(db); // Use batch to write all students at once

    // TODO: Maybe add further validation of student data
    for (const student of students) {
      // If any of the required fields are missing, return an error
      if (!student.name || !student.classId || !student.birthday) {
        throw new Error("Fejl - manglende data");
      }
      student.checkedIn = false; // Checked in status is false by default
      student.parents = ""; // ID of parent object will be added after parent creation
      const studentRef = doc(collection(db, "students")); // Create reference to student object
      batch.set(studentRef, student); // Add student to batch
      studentIds.push(studentRef.id); // Add student ID to array
    }

    await batch.commit(); // Commit batch to database

    // Add parents to database
    // Format for parent object:
    // {
    //   students: [
    //     "studentId1",
    //     "studentId2",
    //     ...
    //   ],
    //   parents: [
    //     {
    //       name: "Parent Name",
    //       phone: "12345678",
    //       email: ""
    //     },
    //     ...
    //   ],
    // }

    const parentObject = {
      students: studentIds,
      parents: parents,
    };
    console.log(parentObject);

    const parentDoc = await addDoc(collection(db, "parents"), parentObject); // Add parent to database
    const parentDocId = parentDoc.id; // Get ID of parent object

    // Add parent ID to students

    batch = writeBatch(db); // Use batch to update all students at once

    for (const studentId of studentIds) {
      const studentDoc = doc(collection(db, "students"), studentId); // Create reference to student object
      // Update parents array in student object
      batch.update(studentDoc, {
        parents: parentDocId,
      });
    }
    await batch.commit(); // Commit batch to database

    // If everything went well, create a new user using the /signup/parent route
    await fetch("http://localhost:6969/signup/parent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parents[0].email,
        parentId: parentDocId,
      }),
    }).then((response) => {
      if (response.status === 200) {
        console.log("User created");
      } else {
        throw new Error("Fejl - bruger kunne ikke oprettes");
      }
    });
  } catch (error) {
    console.log(error);
    transactionError = error;
    res.status(400).send("Fejl ved oprettelse af elev");
  } finally {
    if (transactionError) {
      // TODO: Rollback doesn't work properly yet
      // Handle the rollback here
      console.log("Rolling back changes...");
      console.log("ParentDocId:", parentDocId);

      // Delete the parent and associated students
      if (parentDocId !== null) {
        const deletePromises = [
          deleteDoc(doc(db, "parents", parentDocId)),
          ...studentIds.map((studentId) => {
            if (studentId) {
              // Ensure studentId is valid
              return deleteDoc(doc(db, "students", studentId));
            }
            return null; // Return null for invalid studentId
          }),
        ];

        await Promise.all(deletePromises);
      } else {
        console.log("ParentDocId is null, skipping deletion.");
      }

      console.log("Changes rolled back.");
    } else {
      // Transaction was successful
      res.status(201).send(studentIds);
    }
  }
});

/* Slet elev */
router.delete("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    const docDelete = await deleteDoc(doc(db, "students", id));
    res.status(200).send("Elev slettet");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - eleven findes ikke.");
  }
});

/* Opdater elev */
router.put("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    const docRef = doc(db, "students", id);
    await updateDoc(docRef, req.body);
    res.status(200).send("Elev opdateret");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - eleven findes ikke.");
  }
});

/* Hent elever tilstede*/
router.get("/checkedIn", async (req, res) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "students"), where("checkedIn", "==", true))
    );
    const students = querySnapshot.docs.map((doc) => doc.data());
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - elever ikke fundet.");
  }
});

/* Opdater elev tilstedeværelse */
router.put("/toggleCheckedIn/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const docRef = doc(db, "students", studentId);
    const studentDoc = await getDoc(docRef);

    if (!studentDoc.exists()) {
      throw new Error("Eleven findes ikke.");
    }
    const currentCheckedInStatus = studentDoc.data().checkedIn;
    const updatedCheckedInStatus = !currentCheckedInStatus;
    await updateDoc(docRef, { checkedIn: updatedCheckedInStatus });
    res
      .status(200)
      .send(`Elevens checkedIn opdateres: ${updatedCheckedInStatus}`);
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - kunne ikke opdatere elev.");
  }
});

/* Slet elev */
router.delete("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    const docDelete = await deleteDoc(doc(db, "students", id));
    res.status(200).send("Elev slettet");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - eleven findes ikke.");
  }
});

/* Opdater elev */
router.put("/:id", async (req, res) => {
  let id = req.params.id;

  try {
    const docRef = doc(db, "students", id);
    await updateDoc(docRef, req.body);
    res.status(200).send("Elev opdateret");
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - eleven findes ikke.");
  }
});

/* Hent elever tilstede*/
router.get("/checkedIn", async (req, res) => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "students"), where("checkedIn", "==", true))
    );
    const students = querySnapshot.docs.map((doc) => doc.data());
    res.status(200).send(students);
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - elever ikke fundet.");
  }
});

/* Opdater elev tilstedeværelse */
router.put("/toggleCheckedIn/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const docRef = doc(db, "students", studentId);
    const studentDoc = await getDoc(docRef);

    if (!studentDoc.exists()) {
      throw new Error("Eleven findes ikke.");
    }
    const currentCheckedInStatus = studentDoc.data().checkedIn;
    const updatedCheckedInStatus = !currentCheckedInStatus;
    await updateDoc(docRef, { checkedIn: updatedCheckedInStatus });
    res
      .status(200)
      .send(`Elevens checkedIn opdateres: ${updatedCheckedInStatus}`);
  } catch (error) {
    console.log(error);
    res.status(404).send("Fejl - kunne ikke opdatere elev.");
  }
});

export default router;
