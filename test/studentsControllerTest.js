import { expect as _expect } from "chai";
const expect = _expect;
import { adminDB } from "../src/config/firebase-admin.js";
import { toggleCheckedInStatus } from "../src/api/controllers/studentsController.js";

describe("toggleCheckedInStatus Function", () => {
  it("should toggle the checkedIn status of a student", async () => {
    const testStudentId = "1CNqi56kl0UU6DBzKUVh"; // Find et passende test id fra databasen (kan være skiftende)

    // Initial check of student status
    let studentSnapshot = await adminDB
      .collection("students")
      .doc(testStudentId)
      .get();
    let initialStatus = studentSnapshot.data().checkedIn;

    // Toggle status
    await toggleCheckedInStatus(testStudentId);

    // Check status after toggle
    studentSnapshot = await adminDB
      .collection("students")
      .doc(testStudentId)
      .get();
    let toggledStatus = studentSnapshot.data().checkedIn;

    // Assertions
    expect(studentSnapshot.exists).to.be.true;
    expect(toggledStatus).to.be.a("boolean");
    expect(toggledStatus).to.not.equal(initialStatus);

    // Toggle back to initial state for cleanup
    await adminDB
      .collection("students")
      .doc(testStudentId)
      .update({ checkedIn: initialStatus });
  });
});
