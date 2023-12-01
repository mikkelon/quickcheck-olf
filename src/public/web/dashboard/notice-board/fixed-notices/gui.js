import {
  getAllAgreements,
  deleteAgreementById,
} from "../../../../utility/datahandler.js";

async function displayAllAgreements() {
  let agreementBoard = document.getElementById("notice");
  agreementBoard.innerHTML = "";

  const agreements = await getAllAgreements();
  console.log(agreements);

  agreements.sort((a, b) => {
    // sort on agreement.student.name
    if (a.student.name < b.student.name) return -1;
    else if (a.student.name > b.student.name) return 1;
    else return 0;
  });

  agreements.forEach(agreement => {
    let agreementElement = document.createElement("div");
    agreementElement.className = "agreement";
    const concerningContainer = document.createElement("div");
    const concerningElement = document.createElement("p");
    concerningElement.className = "concerning";
    concerningElement.innerHTML =
      agreement.student.name + " (" + agreement.student.class.colorLabel + ")";
    concerningContainer.appendChild(concerningElement);

    if (agreement.daysValid.length === 7) {
      const daysValidContainer = document.createElement("div");
      daysValidContainer.className = "days-valid";
      const daysValidElement = document.createElement("p");
      daysValidElement.innerText = "Alle dage";
      daysValidContainer.appendChild(daysValidElement);
      agreementElement.appendChild(daysValidContainer);
    } else if (agreement.daysValid.length !== 0) {
      const weekdays = [
        "Søndag",
        "Mandag",
        "Tirsdag",
        "Onsdag",
        "Torsdag",
        "Fredag",
        "Lørdag",
      ];
      const daysValidContainer = document.createElement("div");
      daysValidContainer.className = "days-valid";
      const daysValidText = agreement.daysValid.map(day => weekdays[day]);
      daysValidText.forEach(day => {
        const dayElement = document.createElement("p");
        dayElement.innerText = day;
        daysValidContainer.appendChild(dayElement);
      });

      agreementElement.appendChild(daysValidContainer);
    }

    const messageElement = document.createElement("p");
    messageElement.innerText = agreement.message;

    let crossElement = document.createElement("div");
    crossElement.className = "cross";
    crossElement.innerHTML = `<i class="fas fa-times"></i>`;

    crossElement.addEventListener("click", () => {
      agreementElement.remove();
      console.log(agreement.id);
      deleteAgreementById(agreement.id);
    });

    agreementElement.appendChild(concerningContainer);
    agreementElement.appendChild(messageElement);
    agreementElement.appendChild(crossElement);
    agreementBoard.appendChild(agreementElement);
  });
}

displayAllAgreements();
