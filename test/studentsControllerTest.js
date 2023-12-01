import { expect } from "chai";
import { adminDB } from "../src/config/firebase-admin.js";
import { toggleCheckedInStatus } from "../src/api/controllers/studentsController.js";

describe("toggleCheckedInStatus Function", () => {
  it("should toggle the checkedIn status of a student", async () => {
    
    // Get a random student from the database
    let studentSnapshot = await adminDB.collection("students").get();
    let studentDoc = studentSnapshot.docs[0];


    expect(studentDoc.exists).to.be.true;

    let studentId = studentDoc.id;
    let initialStatus = studentDoc.data().checkedIn;

    // Toggle status
    await toggleCheckedInStatus(studentId);

    // Check status after toggle
    studentSnapshot = await adminDB.collection("students").doc(studentId).get();
    let toggledStatus = studentSnapshot.data().checkedIn;

    // Assertions
    expect(studentSnapshot.exists).to.be.true;
    expect(toggledStatus).to.be.a("boolean");
    expect(toggledStatus).to.not.equal(initialStatus);

    // Toggle back to initial state for cleanup
    await adminDB
      .collection("students")
      .doc(studentId)
      .update({ checkedIn: initialStatus });
  });
});
