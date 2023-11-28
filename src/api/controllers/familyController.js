import { adminAuth, adminDB } from "../../config/firebase-admin.js";
import { createUser } from "./authController.js";

const createFamily = async (parents, students) => {
  const studentIds = [];
  let parentsId = "";
  let userId = "";

  try {
    // Create parents
    parentsId = await createParents(parents);

    // Create students
    studentIds.push(
      ...(await createStudentsWithParentsId(students, parentsId))
    );

    // Create parent user
    const userRecord = await createParentUserWithEmailAndId(
      parents[0].email,
      parentsId
    );
    userId = userRecord.uid;

    return parentsId;
  } catch (error) {
    console.error(error);
    if (parentsId) {
      await adminDB.collection("parents").doc(parentsId).delete();
      console.log("parents deleted");
    }

    // Delete students, if created
    if (studentIds.length > 0) {
      studentIds.forEach(async (studentId) => {
        await adminDB.collection("students").doc(studentId).delete();
      });
      console.log("students deleted");
    }

    // Delete user, if created
    if (userId) {
      await adminAuth.deleteUser(userId);
      console.log("user deleted");
    }

    throw new Error("Fejl ved oprettelse af familie");
  }
};

const createParents = async (parents) => {
  if (!parents || parents.length === 0) {
    throw new Error("Fejl - manglende data");
  }

  parents.forEach((parent) => {
    if (!parent.name || !parent.email || !parent.phone) {
      throw new Error("Fejl - manglende data");
    }
  });

  try {
    const docRef = await adminDB.collection("parents").add({ parents });
    console.log("Parents object created with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(error);
    throw new Error("Fejl ved oprettelse af forælder");
  }
};

/**
 * Create a new parents user in firebase
 * @param {string} email The email
 * @param {string} parentsId The parents id
 * @returns {Promise} A promise that resolves with the new user's data
 */
const createParentUserWithEmailAndId = async (email, parentsId) => {
  if (!email || !parentsId) {
    throw new Error("Fejl - manglende data");
  }

  try {
    const userRecord = await createUser(email, parentsId, "parents");

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

const createStudentsWithParentsId = async (students, parentsId) => {
  if (!students || !parentsId || students.length === 0) {
    throw new Error("Fejl - manglende data");
  }

  try {
    const batch = adminDB.batch();
    const studentIds = [];

    students.forEach((student) => {
      if (!student.name || !student.classId) {
        throw new Error("Fejl - manglende data");
      }

      const studentRef = adminDB.collection("students").doc();
      batch.set(studentRef, {
        ...student,
        parentsId,
        checkedIn: false,
      });
      studentIds.push(studentRef.id);
    });

    await batch.commit();
    console.log("Students created");
    return studentIds;
  } catch (error) {
    console.error(error);
    throw new Error("Fejl ved oprettelse af elever");
  }
};

export { createFamily };
