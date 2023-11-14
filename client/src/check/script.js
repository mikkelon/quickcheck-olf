const url = "http://localhost:6969/classes";
const options = {
  method: "GET",
};

const getClasses = async () => {
  await fetch(url, options).then((response) => {
    response.json().then((data) => {
      console.log(data);

      data.forEach((classData) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-class-id", classData.id);

        const cardText = document.createElement("p");
        cardText.innerText = classData.colorLabel;

        card.appendChild(cardText);

        card.style.backgroundColor = classData.color;

        const main = document.querySelector("main");
        main.appendChild(card);
        card.addEventListener("click", () => {
          const classColor = card.getAttribute("data-class-id");
          window.location.href = `class/?classId=${classColor}`;
        });
      });
    });
  });
};

getClasses();
