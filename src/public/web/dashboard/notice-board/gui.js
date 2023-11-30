import { realtimeNoticeBoard, realtimeNoticeBoardDelete, realtimeNoticeBoardUpdate } from "../../../utility/realtime.js";

const notices = [
    // {
    //   sender: {
    //     name: "Browly",
    //     relation: "Far",
    //   },
    //   concerns: [
    //     {
    //       name: "Kuririn",
    //       class: "Pink",
    //     },
    //   ],
    //   message:
    //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl quis aliquam ultricies, nunc",
    //   read: true,
    // },
];


function loadNotices() {
  let noticeBoard = document.getElementById("notices");
  noticeBoard.innerHTML = "";

  if (notices.length == 0) {
    let noNotices = document.createElement("div");
    noNotices.className = "no-notices";
    noNotices.innerHTML = `<p>Der er ingen beskeder at vise</p>`;
    noticeBoard.appendChild(noNotices);
  }

  console.log(notices);

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

function displayNotice(notice) {
  let noticeElement = document.createElement("div");
  noticeElement.className = "notice";
  noticeElement.innerHTML = `
    <div class="concerning">
        <p>${notice.sender.name} (<span>${notice.sender.relation}</span>)</p>
        <div class="concerns">
            ${notice.concerns.length > 1
      ? `<p>${notice.concerns[0].name} + ${notice.concerns.length - 1
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
    loadNotices();
  });
  noticeElement.appendChild(checkButton);

  return noticeElement;
}

loadNotices();

realtimeNoticeBoard((notice) => {
  notices.push(notice);
  loadNotices();
});

realtimeNoticeBoardUpdate((notice) => {
  notices[notice.index] = notice;
  loadNotices();
});

realtimeNoticeBoardDelete((notice) => {
  notices.splice(notice.index, 1);
  loadNotices();
});