/**
 * Get all students based on classId
 * @param {*} classId The id of the class (firebase document id)
 * @returns {Array} Array of students
 */
export const getStudentsByClassId = async (classId) => {
  const url = `http://localhost:6969/students/${classId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};
