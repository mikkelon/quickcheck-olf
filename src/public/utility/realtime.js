import { ref, onChildAdded, onChildChanged, onChildRemoved, set, push } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
import { realtimeDB } from "./firebase.js";

const realtime = ref(realtimeDB, "notice-board");

export const realtimeNoticeBoard = (callback) => {
    onChildAdded(realtime, (snapshot) => {
        callback(snapshot.val());
    });
}

export const realtimeNoticeBoardUpdate = (callback) => {
    onChildChanged(realtime, (snapshot) => {
        callback(snapshot.val());
    });
}

export const realtimeNoticeBoardDelete = (callback) => {
    onChildRemoved(realtime, (snapshot) => {
        callback(snapshot.val());
    });
}

/**
 * 
 * @param {{name, relation}} sender 
 * @param {[{name, class}, {name, class}]} concerns 
 * @param {string} message 
 */
export function writeNotice(sender, concerns, message, sendDate) {
    console.log(sender)

    console.log(concerns)

    const newPostRef = push(realtime);
    set(newPostRef, {
        sender: sender,
        concerns: concerns,
        message: message,
        read: false,
        sendDate: sendDate
    }).then(() => {
        console.log('Notice written to realtime database');
    }).catch((error) => {
        console.error('Error writing notice to realtime database:', error);
    });
}