import {
  realtimeNoticeBoard,
  realtimeNoticeBoardDelete,
  realtimeNoticeBoardUpdate,
  updateNotice,
} from "../../../utility/realtime.js";
import { getDailyAgreements } from "../../../utility/datahandler.js";

const notices = [];
const dailyAgreementsContainer = document.getElementById("daily-agreements");

function loadNotices() {
  let noticeBoard = document.getElementById("notices");

  noticeBoard.innerHTML = "";

  if (notices.length == 0) {
    let noNotices = document.createElement("div");
    noNotices.className = "no-notices";
    noNotices.innerHTML = `<p>Der er ingen beskeder at vise</p>`;
    noticeBoard.appendChild(noNotices);
  }

  // Load unread notices
  for (let i = 0; i < notices.length; i++) {
    let notice = notices[i];
    if (notice.read) continue;

    const noticeElement = displayNotice(notice);

    noticeBoard.appendChild(noticeElement);
  }

  // Load read notices
  for (let i = 0; i < notices.length; i++) {
    let notice = notices[i];
    if (!notice.read) continue;

    const noticeElement = displayNotice(notice);
    noticeElement.classList.add("read");

    noticeBoard.appendChild(noticeElement);
  }
}

async function loadAgreements() {
  // Load daily agreements
  const dailyAgreements = await getDailyAgreements();
  console.log(dailyAgreements);
  dailyAgreements.forEach(agreement => {
    displayAgreement(agreement);
  });
}

function displayNotice(notice) {
  let noticeElement = document.createElement("div");
  noticeElement.className = "notice";
  noticeElement.innerHTML = `
    <div class="concerning">
        <p>${notice.sender.name} (<span>${notice.sender.relation}</span>)</p>
        <div class="concerns">
            ${
              notice.concerns.length > 1
                ? `<p>${notice.concerns[0].name} + ${
                    notice.concerns.length - 1
                  }</p>`
                : `<p>${notice.concerns[0].name} (<span>${notice.concerns[0].class}</span>)</p>`
            }
        </div>
    </div>
    
    <div class="message">
        <p>${notice.message}</p>
    </div>`;

  let checkButton = document.createElement("button");
  checkButton.className = "check-button";

  if (notice.read) {
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

  return noticeElement;
}

function displayAgreement(agreement) {
  const student = agreement.student;
  let agreementElement = document.createElement("div");
  agreementElement.className = "notice";
  const classAndNameElement = document.createElement("p");
  classAndNameElement.innerText = `${student.name} (${student.class.colorLabel})`;
  const messageElement = document.createElement("p");
  messageElement.innerText = agreement.message;

  agreementElement.appendChild(classAndNameElement);
  agreementElement.appendChild(messageElement);

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
