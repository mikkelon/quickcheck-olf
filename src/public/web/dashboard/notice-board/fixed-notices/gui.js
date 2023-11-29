const fixedNotices = [
  {
    sender: {
      name: "Mr. John Doe",
      relation: "Far",
    },
    concerns: [
      {
        name: "ArniBjarniBent",
        class: "Blå",
      },
      {
        name: "Son Goku",
        class: "Rød",
      },
    ],
    message:
      "ArniBjarniBent og Son Goku bliver hentet af deres bedstefar hver torsdag da deres mor er på arbejde.",
  },
    {
    sender: {
      name: "Mr. John Doe",
      relation: "Far",
    },
    concerns: [
      {
        name: "Son Goku",
        class: "Rød",
      },
    ],
    message:
      "ArniBjarniBent og Son Goku bliver hentet af deres bedstefar hver torsdag da deres mor er på arbejde.",
    },
    
    
];

function displayFixedNotices() {
  let noticeBoard = document.getElementById("notice");
  noticeBoard.innerHTML = "";

  fixedNotices.forEach((notice) => {
    let noticeElement = document.createElement("div");
    noticeElement.className = "notice";

    let concernsElement = document.createElement("div");
    concernsElement.className = "concerns";
    concernsElement.innerHTML = notice.concerns
      .map(
        (concern) => `<p>${concern.name} <span>(${concern.class})</span></p>`
      )
      .join("");

    let messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.innerHTML = `<p>${notice.message}</p>`;

    let dateElement = document.createElement("div");
    dateElement.className = "date";
    dateElement.innerHTML = `<p>${notice.date}</p>`;

    let crossElement = document.createElement("div");
    crossElement.className = "cross";
    crossElement.innerHTML = `<i class="fas fa-times"></i>`;

    noticeElement.appendChild(concernsElement);
    noticeElement.appendChild(messageElement);
    noticeElement.appendChild(dateElement);
    noticeBoard.appendChild(noticeElement);
    noticeElement.appendChild(crossElement);
  });
}

displayFixedNotices();