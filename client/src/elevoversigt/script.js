import { getStudentsWithClass } from "../datahandler.js";

const studentContainer = document.querySelector(".students");

const studentArray = [];

const renderStudent = (student) => {
  const studentElement = document.createElement("div");
  studentElement.classList.add("student");

  const studentName = document.createElement("p");
  studentName.textContent = student.name ? student.name : "N/A";
  studentElement.appendChild(studentName);

  const studentClass = document.createElement("p");
  studentClass.textContent = student.class?.colorLabel
    ? student.class.colorLabel
    : "N/A";
  studentClass.style.color = student.class?.color
    ? student.class.color
    : "black";
  studentElement.appendChild(studentClass);

  const studentCheckBtn = document.createElement("div");
  studentCheckBtn.classList.add("check-btn");
  studentCheckBtn.classList.add(
    student.checkedIn ? "checked-in" : "checked-out"
  );
  studentElement.appendChild(studentCheckBtn);

  studentContainer.appendChild(studentElement);
};

const renderStudents = () => {
  studentContainer.innerHTML = "";
  studentArray.forEach(renderStudent);
};

const fetchStudents = async () => {
  const students = await getStudentsWithClass();
  studentArray.push(...students);

  renderStudents();
};

fetchStudents();
