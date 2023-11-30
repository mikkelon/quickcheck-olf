import { ref, onChildAdded, onChildChanged, onChildRemoved, push, update, child } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { realtimeDB } from "./firebase.js";

const realtime = ref(realtimeDB, "notice-board");

export const realtimeNoticeBoard = (callback) => {
    onChildAdded(realtime, (snapshot) => {
        console.log(snapshot.key);
        callback({ key: snapshot.key, ...snapshot.val() });
    });
}

export const realtimeNoticeBoardUpdate = callback => {
  onChildChanged(realtime, snapshot => {
    callback(snapshot.val());
  });
};

export const realtimeNoticeBoardDelete = callback => {
  onChildRemoved(realtime, snapshot => {
    callback(snapshot.val());
  });
};

/**
 *
 * @param {{name, relation}} sender
 * @param {[{name, class}, {name, class}]} concerns
 * @param {string} message
 */
export async function writeNotice(data) {
  const { sendDate, sender, concerns, message } = data;

  const newPostRef = push(realtime);
  await set(newPostRef, {
    sender: sender,
    concerns: concerns,
    message: message,
    read: false,
    sendDate: sendDate,
  });
}

export function updateNotice(key, noticeData) {
    const updates = {};
    updates[key] = noticeData;

    return update(realtime, updates);
}