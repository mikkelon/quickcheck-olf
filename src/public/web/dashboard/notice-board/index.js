const notices = [
    {
        sender: {
            name: "John Doe",
            relation: "Far"
        },
        concerns: [
            {
                name: "ArniBjarniBent",
                class: "Blå"
            },
            {
                name: "Son Goku",
                class: "Rød"
            }
        ],
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl quis aliquam ultricies, nunc",
        read: false
    },
    {
        sender: {
            name: "Diane Johnson",
            relation: "Mor"
        },
        concerns: [
            {
                name: "Arne",
                class: "Pink"
            }
        ],
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl quis aliquam ultricies, nunc",
        read: false
    },
    {
        sender: {
            name: "Browly",
            relation: "Far"
        },
        concerns: [
            {
                name: "Kuririn",
                class: "Pink"
            }
        ],
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl quis aliquam ultricies, nunc",
        read: true
    }
]

function loadNotices() {
    let noticeBoard = document.getElementById("notice-board");

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

function markAsRead(index) {
    let notice = document.getElementsByClassName("notice")[index];
    notice.styles.backgroundColor = "white";
}

function displayNotice(notice) {
    let noticeElement = document.createElement("div");
    noticeElement.className = "notice";
    noticeElement.innerHTML = `
    <div class="concerning">
        <p>${notice.sender.name} (<span>${notice.sender.relation}</span>)</p>
        <div class="concerns">
            ${notice.concerns.length > 1 ?
            `<p>${notice.concerns[0].name} + ${notice.concerns.length - 1}</p>` :
            `<p>${notice.concerns[0].name} (<span>${notice.concerns[0].class}</span>)</p>`
        }
        </div>
    </div>
    
    <div class="message">
        <p>${notice.message}</p>
    </div>`

    let checkButton = document.createElement("button");
    checkButton.className = "check-button";
    checkButton.innerText = "Markér som \"udført\"";
    checkButton.addEventListener("click", () => {
        markAsRead(i);
    });
    noticeElement.appendChild(checkButton);

    return noticeElement;
}

loadNotices();