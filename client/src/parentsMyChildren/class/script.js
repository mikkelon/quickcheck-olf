import { getStudentsByClassId } from "../../datahandler.js";

const backBtn = document.querySelector(".back-btn");

backBtn.addEventListener("click", () => {
  window.location.href = "../";
});

let børn = [
  { name: "Børge", checkedIn: true },
  { name: "Sofie", checkedIn: false }
];

const params = new URLSearchParams(window.location.search);
const classId = params.get("classId");

const renderCards = () => {
  børn.forEach((student) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-student-id", student.id);

    const infoButton = document.createElement("button");
    infoButton.classList.add("info-button");
    const infoIcon = document.createElement("img");
    infoIcon.src = "../../../assets/icons/information-fill.svg";
    infoButton.appendChild(infoIcon);
    card.appendChild(infoButton);

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

    const cardLocation = document.createElement("p");
    cardLocation.classList.add("location");
    cardLocation.textContent = student.location
      ? student.location
      : "Ukendt lokation";
    textContainer.appendChild(cardLocation);

    const cardStatus = document.createElement("p");
    cardStatus.classList.add("status");
    let checkedIn = student.checkedIn;
    cardStatus.textContent = checkedIn ? "Ikke hentet" : "Hentet";
    card.classList.add(checkedIn ? "checked-in" : "checked-out");
    textContainer.appendChild(cardStatus);

    card.appendChild(cardImg);
    card.appendChild(textContainer);

    const main = document.querySelector("main");
    main.appendChild(card);

    card.addEventListener("click", () => {
      const status = card.querySelector(".status");
      if (card.classList.contains("checked-in")) {
        card.classList.remove("checked-in");
        card.classList.add("checked-out");
        status.innerHTML = "Hentet";
      } else {
        card.classList.add("checked-in");
        card.classList.remove("checked-out");
        status.innerHTML = "Ikke hentet";
      }
    });
  });
};

renderCards();
