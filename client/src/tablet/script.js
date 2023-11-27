import {
  getClasses,
  getStudentsByClassId,
  getStudents,
} from "../datahandler.js";

const renderCards = async () => {
  const classesData = await getClasses();
  console.log(classesData);

  classesData.sort((a, b) => a.class - b.class);

  try {
    const allStudents = await getStudents();

    for (const classData of classesData) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-class-id", classData.id);

      const cardText = document.createElement("p");
      cardText.innerText = `${classData.colorLabel}`;

      card.appendChild(cardText);

      card.style.backgroundColor = classData.color;

      const section = document.querySelector("section");
      section.appendChild(card);

      // Henter alle elever i klassen

      const students = allStudents.filter(students => students.classId === classData.id);
      const checkedInStudents = students.filter((student) => student.checkedIn);
      const totalStudents = document.createElement("div");
      totalStudents.innerText = `Tjekket ind: ${checkedInStudents.length}/${students.length}`;

      // Opdaterer kortet med hvor mange der er tjekket ind
      card.appendChild(totalStudents);

      card.addEventListener("click", () => {
        const classColor = card.getAttribute("data-class-id");
        window.location.href = `class/?classId=${classColor}`;
      });
    }
  } catch (error) {
    console.error(`Der skete en fejl ved indlæsning af elever:`, error);
    cardText.innerText = `Checked In: Error`;
  }
};

renderCards();
