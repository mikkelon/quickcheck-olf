const apiUrl = "http://localhost:6969/api";

/**
 * Get all students based on classId
 * @param {*} classId The id of the class (firebase document id)
 * @returns {Array} Array of students
 */
export const getStudentsByClassId = async classId => {
  const url = `${apiUrl}/classes/${classId}/students`;

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
 * Gets all students based on parentId
 * @param {string} parentId ID of the parents object in firebase
 * @returns
 */
export const getStudentsByParentId = async parentId => {
  const url = `${apiUrl}/parents/${parentId}/students`;

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
  const url = apiUrl + "/classes";
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

/**
 * Create students and parents
 * @param {*} students
 * @param {*} parents
 */
export const createFamily = async (students, parents) => {
  const url = apiUrl + "/family/create";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ students, parents }),
  };

  try {
    const response = await fetch(url, options);

    console.log(response);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    // Handle errors appropriately, e.g., log or throw them
    console.error("Error creating students and parents:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

/**
 * Creates a new employee user in firebase
 * @param {Object} employee And object containing the employee data
 */
export const createEmployee = async employee => {
  const url = apiUrl + "/signup/employee";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      console.log(data.data.error.code);
      throw new Error(data.data.error.code);
    }
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

/**
 * Get all students
 * @returns {Array} Array of students
 */
export const getStudents = async () => {
  const url = apiUrl + "/students";
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
    console.error("Error fetching students:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

/**
 * Get all students with class information
 * @returns {Array} Array of student objects with imbedded class object
 */
export const getStudentsWithClass = async () => {
  // Fetch students
  const students = await getStudents();

  // Fetch classes
  const classes = await getClasses();

  // Add class information to students
  const studentsWithClass = students.map(student => {
    const studentClass = classes.find(c => c.id === student.classId);
    return {
      ...student,
      class: studentClass,
    };
  });

  return studentsWithClass;
};

/**
 * Toggles the checked in status of a student
 * @param {*} studentId The id of the student (firebase document id)
 */
export const toggleStudentCheckIn = async studentId => {
  const url = `${apiUrl}/students/toggleCheckedIn/${studentId}`;
  const options = {
    method: "PUT",
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    // Handle errors appropriately, e.g., log or throw them
    console.error("Error toggling student check in:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

/**
 * Get all parents
 * @returns {Array} Array of parents
 */
export const getParentsById = async parentsId => {
  const url = `${apiUrl}/parents/${parentsId}`;
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
    console.error("Error fetching parents:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

/**
 * Delete a student with a given studentId
 * @param {string} studentId
 */
export const deleteStudent = async studentId => {
  const url = `${apiUrl}/students/${studentId}`;
  const options = {
    method: "DELETE",
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    // Handle errors appropriately, e.g., log or throw them
    console.error("Error deleting student:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

/**
 * Get a student with a given studentId
 * @param {string} studentId
 */
export const getStudentById = async studentId => {
  const url = `${apiUrl}/students/${studentId}`;
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
    console.error("Error fetching student:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

/**
 * Gets a class based on the classId
 * @param {string} classId
 * @returns {Object} Class object
 */
export const getClassById = async classId => {
  const url = `${apiUrl}/classes/${classId}`;
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
    console.error("Error fetching classes:", error);
    throw error;
  }
};

/**
 * FOR TESTING PURPOSES ONLY
 *
 * Gets a random parent's students
 * @returns {Array} Array of students
 */
export const getRandomParentStudents = async () => {
  const parents = await fetch(apiUrl + "/parents").then(res => res.json());

  const randomParent = parents[Math.floor(Math.random() * parents.length)];
  const students = await getStudentsByParentId(randomParent.id);

  return students;
};

export const updateStudent = async student => {
  const url = `${apiUrl}/${student.id}`;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

export const updateParents = async (id, parents) => {
  const url = `${apiUrl}/parents/${id}`;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parents),
  };

  console.log("Updating parents:", parents);

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error updating parents:", error);
    throw error;
  }
};
