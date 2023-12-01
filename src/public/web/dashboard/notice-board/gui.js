import {
  realtimeNoticeBoard,
  realtimeNoticeBoardDelete,
  realtimeNoticeBoardUpdate,
  updateNotice,
} from "../../../utility/realtime.js";
import { getDailyAgreements } from "../../../utility/datahandler.js";

const notices = [];
const dailyAgreementsContainer = document.getElementById("daily-agreements");
let noticeBoard = document.getElementById("notices");

function loadNotices() {
  noticeBoard.innerHTML = "";

  if (notices.length == 0) {
    let noNotices = document.createElement("div");
    noNotices.className = "no-notices";
    noNotices.innerHTML = `<p>Der er ingen beskeder at vise</p>`;
    noticeBoard.appendChild(noNotices);
  }

  const todaysMessages = notices.filter(message => {
    const today = new Date();
    const messageDate = new Date(message.sendDate);
    return today.toDateString() === messageDate.toDateString();
  });

  todaysMessages.sort((a, b) => {
    // Sort by read status
    if (a.read && !b.read) return 1;
    else if (!a.read && b.read) return -1;
    return 0;
  });

  todaysMessages.forEach(message => {
    displayNotice(message);
  });
}

async function loadAgreements() {
  // Load daily agreements
  const dailyAgreements = await getDailyAgreements();
  if (dailyAgreements.length == 0) {
    let noAgreements = document.createElement("div");
    noAgreements.className = "no-agreements";
    noAgreements.innerHTML = `<p>Der er ingen aftaler at vise.</p>`;
    dailyAgreementsContainer.appendChild(noAgreements);
  }
  console.log(dailyAgreements);
  dailyAgreements.forEach(agreement => {
    displayAgreement(agreement);
  });
}

function displayNotice(notice) {
  let noticeElement = document.createElement("div");
  if (notice.read) noticeElement.classList.add("read");

  noticeElement.className = "notice";
  const noticeContentElement = document.createElement("div");
  noticeContentElement.className = "notice-content";

  const senderElement = document.createElement("p");
  senderElement.classList.add("sender");
  senderElement.innerText = `${notice.sender.name} ${
    notice.sender.relation ? "(" + notice.sender.relation + ")" : ""
  }`;

  const concerning = document.createElement("p");
  concerning.classList.add("concerning");
  concerning.innerText = notice.concerns
    .map(concern => `${concern.name} (${concern.class})`)
    .join(", ");

  const messageElement = document.createElement("p");
  messageElement.classList.add("message");
  messageElement.innerText = notice.message;

  noticeContentElement.appendChild(concerning);
  noticeContentElement.appendChild(senderElement);
  noticeContentElement.appendChild(messageElement);

  noticeElement.appendChild(noticeContentElement);

  let checkButton = document.createElement("button");
  checkButton.className = "check-button";

  if (notice.read) {
    noticeElement.classList.add("read");
    checkButton.innerText = "Udført";
    checkButton.classList.add("read");
  } else {
    checkButton.innerText = "Ikke udført";
    checkButton.classList.remove("read");
  }
  checkButton.addEventListener("click", () => {
    notice.read = !notice.read;
    updateNotice(notice.key, notice);
    loadNotices();
  });
  noticeElement.appendChild(checkButton);

  noticeBoard.appendChild(noticeElement);
}

function displayAgreement(agreement) {
  const student = agreement.student;
  let agreementElement = document.createElement("div");
  agreementElement.className = "notice";
  const agreementContentElement = document.createElement("div");
  const classAndNameElement = document.createElement("p");
  classAndNameElement.classList.add("concerning");
  classAndNameElement.innerText = `${student.name} (${student.class.colorLabel})`;
  const messageElement = document.createElement("p");
  messageElement.classList.add("agreement-message");
  messageElement.innerText = agreement.message;

  agreementContentElement.appendChild(classAndNameElement);
  agreementContentElement.appendChild(messageElement);
  agreementElement.appendChild(agreementContentElement);
  dailyAgreementsContainer.appendChild(agreementElement);
}

loadNotices();
loadAgreements();

realtimeNoticeBoard(notice => {
  notices.push(notice);
  loadNotices();
});

realtimeNoticeBoardUpdate(notice => {
  notices[notice.index] = notice;
  loadNotices();
});

realtimeNoticeBoardDelete(notice => {
  notices.splice(notice.index, 1);
  loadNotices();
});
