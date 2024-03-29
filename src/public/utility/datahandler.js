import config from "./config.js";
const apiUrl = config.apiUrl;

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
      id: student.id,
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

// Create agreement
export const createAgreement = async (studentId, agreement) => {
  const url = `${apiUrl}/agreements`;
  const options = {
    method: "POST",
    body: JSON.stringify({ studentId, ...agreement }),
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log("prepost: " + JSON.stringify({ studentId, ...agreement }));

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

export const deleteAgreementById = async agreementId => {
  const url = `${apiUrl}/agreements/${agreementId}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    // Handle errors appropriately, e.g., log or throw them
    console.error("Error fetching agreement:", error);
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
    console.error("Error fetching parents:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};

// GET aftaler til en elev
export const getAgreementsByStudentId = async studentId => {
  const url = `${apiUrl}/agreements/${studentId}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error getting aftaler:", error);
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

export const updateStudent = async student => {
  const url = `${apiUrl}/students/${student.id}`;
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  };

  console.log("Updating student:", student);

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
  console.log(id, parents);
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

/**
 * Add new parent object to parentsObj
 * @param {string} id parentsObj id
 * @param {Object} parent object containing name, relation, phone, email.
 */
export const addParent = async (id, parent) => {
  const url = `${apiUrl}/parents/${id}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parent),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error adding parent:", error);
    throw error;
  }
};

/**
 * Delete parent object from parentsObj using index in parents array
 * @param {string} id parentsObj id
 * @param {number} index index of parent in parents array
 */
export const deleteParentByIndex = async (id, index) => {
  const url = `${apiUrl}/parents/${id}/${index}`;
  const options = {
    method: "DELETE",
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Error deleting parent:", error);
    throw error;
  }
};

/**
 * Requests a session cookie based on the idToken
 * @param {string} idToken
 */
export const requestSessionCookie = async idToken => {
  const url = `${apiUrl}/login`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.data.error.code);
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Deletes the session cookie
 */
export const requestDeleteSessionCookie = async () => {
  const url = `${apiUrl}/login`;
  const options = {
    method: "DELETE",
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.data.error.code);
    }
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/**
 * Gets the buttons for the given role for the dashboard display
 * @returns {Array} Array of buttons
 */
export const getButtonsForRole = async () => {
  const url = `${apiUrl}/dashboard`;
  const options = {
    method: "GET",
  };

  try {
    const response = await fetch(url, options);
    console.log(response);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.data.error.code);
    }

    return data;
  } catch (error) {
    console.log("Error getting buttons for role:", error);
    throw error;
  }
};

/**
 * Gets the students associated with the current user
 * @returns {Array} Array of students
 */
export const getStudentsBySessionCookie = async () => {
  const url = `${apiUrl}/parents/students`;
  const options = {
    method: "GET",
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return data;
  } catch (error) {
    console.error("Error getting students by session cookie:", error);
    throw error;
  }
};

/**
 * Gets the parents associated with the current user
 * @returns {Object} Object with parents' ID and array of parents.
 */

export const getParentInfoBySessionCookie = async () => {
  const url = `${apiUrl}/parents/info`;
  const options = {
    method: "GET",
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return data;
  } catch (error) {
    console.error("Error getting parents by session cookie:", error);
    throw error;
  }
};

export const getDailyAgreements = async () => {
  // fetch daily agreements
  const url = `${apiUrl}/agreements/daily`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error getting daily agreements:", error);
    throw error;
  }
};

export const getAllAgreements = async () => {
  const url = `${apiUrl}/agreements`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error getting all agreements:", error);
    throw error;
  }
};
