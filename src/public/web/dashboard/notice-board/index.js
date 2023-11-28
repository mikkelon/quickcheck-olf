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
        read: false
    }
]

function loadNotices() {
    let noticeBoard = document.getElementById("notice-board");
    for (let i = 0; i < notices.length; i++) {
        let notice = notices[i];
        let noticeElement = document.createElement("div");
        noticeElement.className = "notice";
        noticeElement.innerHTML = `
        <div class="concerning">
            <div class="sender">
                <div class="status"></div>
                <p>${notice.sender.name} (<span>${notice.sender.relation}</span>)</p>
            </div>
            <div class="concerns">
                ${
                    notice.concerns.length > 1 ?
                    `<p>${notice.concerns[0].name} + ${notice.concerns.length - 1}</p>` :
                    `<p>${notice.concerns[0].name}</p>`
                }
            </div>
        </div>
        
        
        <div class="message">
            <p>${notice.message}</p>
        </div>

        <button class="check-button">Markér som "udført"</button>
    `;
        noticeBoard.appendChild(noticeElement);
    }
}

function markAsRead(index) {
    let notice = document.getElementsByClassName("notice")[index];
    notice.styles.backgroundColor = "white";
}

loadNotices();