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

/**
 * Create students and parents
 * @param {*} students
 * @param {*} parents
 */
export const createStudentsAndParents = async (students, parents) => {
  const url = "http://localhost:6969/students";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ students, parents }),
  };

  try {
    const response = await fetch(url, options);

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
 * Get all students
 * @returns {Array} Array of students
 */
export const getStudents = async () => {
  const url = "http://localhost:6969/students";
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
  const studentsWithClass = students.map((student) => {
    const studentClass = classes.find((c) => c.id === student.classId);
    return {
      ...student,
      class: studentClass,
      id: student.id
    };
  });

  console.log(studentsWithClass);

  return studentsWithClass;
};

/**
 * Toggles the checked in status of a student
 * @param {*} studentId The id of the student (firebase document id)
 */
export const toggleStudentCheckIn = async (studentId) => {
  const url = `http://localhost:6969/students/toggleCheckedIn/${studentId}`;
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

export const getParentsById = async (parentsId) => {
  const url = `http://localhost:6969/parents/${parentsId}`;
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

// Create note
export const createNote = async (studentId, note) => {
  const url = `http://localhost:6969/notes`;
  const options = {
    method: "POST",
    body: JSON.stringify({ studentId, ...note }),
    headers: {
      "Content-Type": "application/json",
    },
  }

  console.log("prepost: " + JSON.stringify({ studentId, note }))

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
}


export const deleteNoteById = async (noteId) => {
  const url = `http://localhost:6969/notes/${noteId}`;
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }

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
}

// GET notes til en elev
export const getNotesById = async (studentId) => {
  const url = `http://localhost:6969/notes/${studentId}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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