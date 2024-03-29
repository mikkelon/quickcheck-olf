import { adminAuth } from "../../config/firebase-admin.js";

const buttons = {
  createEmployee: {
    name: "Opret medarbejder",
    link: "/web/dashboard/create-employee",
  },
  createFamily: {
    name: "Opret familie",
    link: "/web/dashboard/create-family",
  },
  studentOverview: {
    name: "Elevoversigt",
    link: "/web/dashboard/student-overview",
  },
  myChildren: {
    name: "Mine børn",
    link: "/web/dashboard/my-children",
  },
  noticeBoard: {
    name: "Opslagstavlen",
    link: "/web/dashboard/notice-board",
  },
  parentInfo: {
    name: "Mine oplysninger",
    link: "/web/dashboard/parent-info",
  },
  sendMessage: {
    name: "Send besked",
    link: "/web/dashboard/send-message",
  },
};
const roles = {
  admin: [
    buttons.createEmployee,
    buttons.createFamily,
    buttons.studentOverview,
    buttons.noticeBoard,
  ],
  employee: [buttons.studentOverview, buttons.noticeBoard],
  parents: [buttons.myChildren, buttons.parentInfo, buttons.sendMessage],
  test: Object.keys(buttons).map((key) => buttons[key]), // TODO: Remove test role
};

export const getButtonsForRole = async (sessionCookie) => {
  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
  const userRole = decodedClaims.role;
  console.log("User role:", userRole);

  const buttonsForRole = roles[userRole];
  return buttonsForRole;
};
