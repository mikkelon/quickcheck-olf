import {
  getClassesById,
  getStudentsByClassId,
  toggleStudentCheckIn,
} from "../../datahandler.js";

const backBtn = document.querySelector(".back-btn");

backBtn.addEventListener("click", () => {
  window.location.href = "../";
});

const classNameElement = document.querySelector("#class-color");
const params = new URLSearchParams(window.location.search);
const classId = params.get("classId");

const renderClassName = async () => {
  try {
    const classInfo = await getClassesById(classId);
    const classColor = classInfo.colorLabel;
    document.body.style.backgroundColor = classInfo.color += "29";
    classNameElement.textContent = `${classColor}`;
  } catch (error) {
    console.error("Error fetching class name:", error);
  }
}


const renderCards = async () => {
  const students = await getStudentsByClassId(classId);
  // Sort students by checked in status
  // Checked in students first
  students.sort((a, b) => {
    if (a.checkedIn && !b.checkedIn) {
      return -1;
    }
    if (!a.checkedIn && b.checkedIn) {
      return 1;
    }
    return 0;
  });

  console.log(students);
  students.forEach((student) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-student-id", student.id);

    const cardImg = document.createElement("img");
    cardImg.classList.add("avatar");
    cardImg.src = student.imgUrl
      ? student.imgUrl
      : "../../../assets/avatar-placeholder.png";

    const textContainer = document.createElement("div");
    textContainer.classList.add("text-container");

    const cardName = document.createElement("p");
    cardName.classList.add("name");
    cardName.textContent = student.name;
    textContainer.appendChild(cardName);

    const cardStatus = document.createElement("p");
    cardStatus.classList.add("status");
    let checkedIn = student.checkedIn;
    cardStatus.textContent = checkedIn ? "Tjekket ind" : "Tjekket ud";
    card.classList.add(checkedIn ? "checked-in" : "checked-out");
    textContainer.appendChild(cardStatus);

    card.appendChild(cardImg);
    card.appendChild(textContainer);

    const main = document.querySelector("main");
    main.appendChild(card);

    card.addEventListener("click", () => {
      toggleStudentCheckIn(student.id);
      const status = card.querySelector(".status");
      if (card.classList.contains("checked-in")) {
        card.classList.remove("checked-in");
        card.classList.add("checked-out");
        status.innerHTML = "Tjekket ud";
      } else {
        card.classList.add("checked-in");
        card.classList.remove("checked-out");
        status.innerHTML = "Tjekket ind";
      }
    });
  });
};

renderCards();
renderClassName();

