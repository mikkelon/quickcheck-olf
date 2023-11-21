import { getClasses } from "../datahandler.js";

const renderCards = async () => {
    const data = await getClasses();
    console.log(data);

    data.sort((a, b) => a.class - b.class);

    data.forEach(classData => {
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
};

renderCards();
