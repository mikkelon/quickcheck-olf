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

/**
 * Get all classes
 * @returns {Array} Array of classes
 */
export const getClasses = async () => {
  const url = "http://localhost:6969/classes";
  const options = {
    method: "GET",
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle errors appropriately, e.g., log or throw them
    console.error("Error fetching classes:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

export const createStudents = async (students) => {
  const url = "http://localhost:6969/students";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(students),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle errors appropriately, e.g., log or throw them
    console.error("Error fetching classes:", error);
    throw error; // Rethrow the error for the caller to handle
  }
}

export const createParents = async (parents, children) => {

  const result = createStudents(children)
    .then((data) => {
      return data.map((student) => student.id);
    })
    .then(async (childrenIds) => {
      const url = "http://localhost:6969/parents";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parents, childrenIds }),
      };

      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching classes:", error);
        throw error; // Rethrow the error for the caller to handle
      }
    });

  return result;
};

