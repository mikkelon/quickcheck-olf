import {
  getStudentsWithClass,
  getClasses,
  toggleStudentCheckIn,
} from "../../../datahandler.js";

// #--- Student list ---#
const studentContainer = document.querySelector(".students");

let studentArray = [];

const renderStudent = (student) => {
  const studentElement = document.createElement("div");
  studentElement.classList.add("student");

  const studentName = document.createElement("p");
  studentName.textContent = student.name ? student.name : "N/A";
  studentElement.appendChild(studentName);

  const studentClassDiv = document.createElement("div");
  studentClassDiv.classList.add("student-class");
  studentClassDiv.style.backgroundColor = student.class.color;
  studentClassDiv.textContent = student.class.colorLabel;
  const colorLabel = student.class.colorLabel.toLowerCase();
  if (colorLabel === "hvid") {
    studentClassDiv.style.outline = "1px solid #000";
  } else if (
    colorLabel === "blå" ||
    colorLabel === "lilla" ||
    colorLabel === "grøn"
  ) {
    studentClassDiv.style.color = "#fff";
  }
  studentElement.appendChild(studentClassDiv);

  const studentCheckBtn = document.createElement("div");
  studentCheckBtn.classList.add("check-btn");
  studentCheckBtn.classList.add(
    student.checkedIn ? "checked-in" : "checked-out"
  );
  studentCheckBtn.addEventListener("click", () => {
    console.log("Toggling check in status", student.id);
    toggleStudentCheckIn(student.id);
    student.checkedIn = !student.checkedIn;
    studentCheckBtn.classList.toggle("checked-in");
    studentCheckBtn.classList.toggle("checked-out");
  });
  studentElement.appendChild(studentCheckBtn);

  studentElement.addEventListener("click", () => {
    // goto student page with id student.id
    window.location.href = `./student/index.html?id=${student.id}`;
  });

  studentContainer.appendChild(studentElement);

};

function sortByClassThenCheckedInStatus(a, b) {
  console.log("sorting");
  // First, compare the class IDs
  const classComparison = a.class.id.localeCompare(b.class.id);

  // If the class IDs are the same, prioritize checked-in students (those with 'checkedIn' set to true)
  if (classComparison === 0) {
    if (a.checkedIn === b.checkedIn) {
      // If both have the same 'checkedIn' status, sort by name
      return a.name.localeCompare(b.name);
    } else {
      // Checked-in students come before non-checked-in students
      return b.checkedIn - a.checkedIn;
    }
  }

  return classComparison; // Sort by class ID
}

const renderStudents = () => {
  studentContainer.innerHTML = "";
  studentArray.sort(sortByClassThenCheckedInStatus);
  studentArray.forEach(renderStudent);
};

const fetchStudents = async () => {
  studentArray = await getStudentsWithClass();

  renderStudents();
};

fetchStudents();

// #--- Class select ---#
let classArray = [];

const renderClassOptions = () => {
  const classSelect = document.querySelector("#class-select");

  classArray.forEach((classObj) => {
    const classOption = document.createElement("option");
    classOption.value = classObj.id;
    classOption.textContent = classObj.colorLabel;
    classSelect.appendChild(classOption);
  });
};

const fetchClasses = async () => {
  classArray = await getClasses();

  renderClassOptions();
};

fetchClasses();

// #--- Active filters ---#
let activeFilters = {
  classes: [],
  checkedIn: false,
  checkedOut: false,
  name: "",
};

const filterStudents = () => {
  console.log("filtering students");
  const filteredStudents = studentArray.filter((student) => {
    const classFilter =
      activeFilters.classes.length === 0 ||
      activeFilters.classes.includes(student.class.id);
    const checkedInFilter = !activeFilters.checkedIn || student.checkedIn;
    const checkedOutFilter = !activeFilters.checkedOut || !student.checkedIn;
    const nameFilter =
      activeFilters.name === "" ||
      student.name.toLowerCase().includes(activeFilters.name.toLowerCase());

    return classFilter && checkedInFilter && checkedOutFilter && nameFilter;
  });

  studentContainer.innerHTML = "";
  if (filteredStudents.length === 0) {
    const noStudents = document.createElement("p");
    noStudents.textContent = "Ingen elever fundet";
    studentContainer.appendChild(noStudents);
  }

  filteredStudents.forEach(renderStudent);
};

// #--- Event listeners ---#
const searchInput = document.querySelector("#search-input");

// Add event listener on input and backspace
searchInput.addEventListener("input", () => {
  activeFilters.name = searchInput.value;
  filterStudents();
  addFilter("name", searchInput.value);
});

const classSelect = document.querySelector("#class-select");
classSelect.addEventListener("change", () => {
  activeFilters.classes = [...activeFilters.classes, classSelect.value];
  filterStudents();
  addFilter("class", classSelect.value);
  classSelect.value = classSelect.firstElementChild.value;
});

const checkedInBtn = document.querySelector("#checked-in-btn");
checkedInBtn.addEventListener("click", () => {
  activeFilters.checkedIn = true;
  addFilter("checkedStatus", "checkedIn");
  filterStudents();
});

const checkedOutBtn = document.querySelector("#checked-out-btn");
checkedOutBtn.addEventListener("click", () => {
  activeFilters.checkedOut = true;
  addFilter("checkedStatus", "checkedOut");
  filterStudents();
});

// #--- Render active filter boxes ---#
const addFilter = (filterType, filterValue) => {
  const activeFiltersContainer = document.querySelector("#active-filters");
  const activeFilterDiv = document.createElement("div");
  activeFilterDiv.classList.add("active-filter");
  const activeFilterText = document.createElement("p");
  activeFilterText.classList.add("active-filter-text");

  // Filter: Name
  if (filterType === "name") {
    // If name filter already exists, remove it
    const nameFilter = activeFiltersContainer.querySelector(
      '[data-filter-type="name"]'
    );
    if (nameFilter) {
      nameFilter.remove();
    }
    if (filterValue === "") {
      checkActiveFilters();
      return;
    }

    activeFilterDiv.dataset.filterType = "name";

    activeFilterDiv.style.opacity = 0.5;
    activeFilterText.dataset.filterValue = filterValue;
    const filterNameText =
      filterValue.length > 10 ? filterValue.slice(0, 10) + "..." : filterValue;
    activeFilterText.innerHTML = `Navn: ${filterNameText}`;
  }

  // Filter: Class
  if (filterType === "class") {
    activeFilterDiv.dataset.filterType = "class";
    // If class filter already exists, return
    const classFilters = activeFiltersContainer.querySelectorAll(
      '[data-filter-type="class"]'
    );
    // if classFilters contains a filter with the same value, return
    const classFilter = Array.from(classFilters).find(
      (classFilter) =>
        classFilter.querySelector(".active-filter-text").dataset.filterValue ===
        filterValue
    );
    if (classFilter) {
      return;
    }

    const classObj = classArray.find((classObj) => classObj.id === filterValue);

    activeFilterDiv.style.backgroundColor = classObj.color;
    activeFilterText.dataset.filterValue = filterValue;
    activeFilterText.innerHTML = classObj.colorLabel;
  }

  // Filter: Checked status
  if (filterType === "checkedStatus") {
    const existingFilter = activeFiltersContainer.querySelector(
      `[data-filter-type="${filterType}"]`
    );

    if (existingFilter) {
      existingFilter.remove();
      if (filterValue === "checkedIn") {
        activeFilters.checkedOut = false;
      } else {
        activeFilters.checkedIn = false;
      }
    }

    activeFilterDiv.dataset.filterType = filterType;
    activeFilterDiv.style.color =
      filterValue === "checkedIn" ? "#00C853" : "#FF5656";
    activeFilterText.dataset.filterValue =
      filterValue === "checkedIn" ? "checkedIn" : "checkedOut";
    activeFilterText.innerHTML = `Tjekket ${filterValue === "checkedIn" ? "ind" : "ud"
      }`;

    console.log(activeFilters);
  }

  // Add text
  activeFilterDiv.appendChild(activeFilterText);

  // Remove button
  const removeDiv = document.createElement("div");
  removeDiv.classList.add("remove-filter");
  removeDiv.addEventListener("click", () => {
    removeFilter(filterType, filterValue);
  });
  activeFilterDiv.appendChild(removeDiv);

  // Add to DOM
  activeFiltersContainer.appendChild(activeFilterDiv);

  // Show or hide active filters container
  const activeFiltersWrapper = document.querySelector(
    "#active-filters-wrapper"
  );
  activeFiltersWrapper.style.display = "flex";
};

const removeFilter = (filterType, filterValue) => {
  if (filterType === "name") {
    activeFilters.name = "";
  } else if (filterType === "class") {
    activeFilters.classes = activeFilters.classes.filter(
      (classId) => classId !== filterValue
    );
  } else if (filterValue === "checkedIn") {
    activeFilters.checkedIn = false;
  } else if (filterValue === "checkedOut") {
    activeFilters.checkedOut = false;
  }

  const activeFiltersContainer = document.querySelector("#active-filters");
  const filterDivs = activeFiltersContainer.querySelectorAll(".active-filter");
  filterDivs.forEach((filterDiv) => {
    if (
      filterDiv.querySelector(".active-filter-text").dataset.filterValue ===
      filterValue
    ) {
      filterDiv.remove();
    } else if (filterType === "checkedIn" || filterType === "checkedOut") {
      filterDiv.remove();
    }
  });

  // If no name filter exists, clear search input
  if (filterType === "name") {
    const nameFilter = activeFiltersContainer.querySelector(
      '[data-filter-type="name"]'
    );
    if (!nameFilter) {
      searchInput.value = "";
    }
  }

  checkActiveFilters();
  filterStudents();
  console.log(activeFilters);
};

const checkActiveFilters = () => {
  const activeFiltersContainer = document.querySelector("#active-filters");
  if (activeFiltersContainer.childElementCount < 1) {
    const activeFiltersWrapper = document.querySelector(
      "#active-filters-wrapper"
    );
    activeFiltersWrapper.style.display = "none";
  }
};
