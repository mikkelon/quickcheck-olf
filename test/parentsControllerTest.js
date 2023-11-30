import { expect as _expect } from "chai";
const expect = _expect;
import { adminDB } from "../src/config/firebase-admin.js";
import { addParent } from "../src/api/controllers/parentsController.js";

describe("addParent Function", () => {
  it("should add a new parent to the parents array", async () => {
    const testParentsId = "XmkgtQQfvdwmg4X0q9kW"; // Find et passende test id fra databasen (kan være skiftende)
    // Example new parent
    const newParent = {
      name: "Test Parent",
      phone: "12345678",
      email: "test@test.test",
      relation: "Test",
    };

    // Backup the current data
    let docSnap = await adminDB.collection("parents").doc(testParentsId).get();
    const originalData = docSnap.data();

    if (!docSnap.exists) {
      throw new Error("Test setup failed - Parent document does not exist.");
    }

    // Add new parent
    await addParent(testParentsId, newParent);

    // Check updated data
    docSnap = await adminDB.collection("parents").doc(testParentsId).get();
    const updatedParents = docSnap.data().parents;

    // Assertions
    expect(updatedParents).to.deep.include(newParent);

    // Restore the original data for cleanup
    await adminDB.collection("parents").doc(testParentsId).update(originalData);
  });
});
