import {
  getRandomParentStudents,
  toggleStudentCheckIn,
  getStudentsByParentId,
} from "../../../../utility/datahandler.js";

let students = [];

const fetchStudents = async parentId => {
  try {
    students = await getStudentsByParentId(parentId);
    students = students.map(student => ({
      id: student.id,
      name: student.name,
      checkedIn: student.checkedIn,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const renderCards = async () => {
  // TEST DATA
  students = await getRandomParentStudents();
  // TODO: When authentication is implemented, get the parent ID from the token
  // await fetchStudents("PARENT ID HERE");
  students.forEach(student => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-student-id", student.id);

    const infoButton = document.createElement("div");
    infoButton.classList.add("info-button");
    const infoIcon = document.createElement("img");
    infoIcon.src = "../../../../assets/icons/information-fill.svg";
    infoButton.appendChild(infoIcon);
    card.appendChild(infoButton);

    const cardImg = document.createElement("img");
    cardImg.classList.add("avatar");
    cardImg.src = student.imgUrl
      ? student.imgUrl
      : "../../../../assets/avatar-placeholder.png";

    const textContainer = document.createElement("div");
    textContainer.classList.add("text-container");

    const cardName = document.createElement("p");
    cardName.classList.add("name");
    cardName.textContent = student.name;
    textContainer.appendChild(cardName);

    const cardLocation = document.createElement("p");
    cardLocation.classList.add("location");
    cardLocation.textContent = student.location
      ? student.location
      : "Ukendt lokation";
    textContainer.appendChild(cardLocation);

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
