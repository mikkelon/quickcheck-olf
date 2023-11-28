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
};
const roles = {
  admin: [
    buttons.createEmployee,
    buttons.createFamily,
    buttons.studentOverview,
    buttons.noticeBoard,
  ],
  employee: [buttons.studentOverview, buttons.noticeBoard],
  parents: [buttons.myChildren],
};

export const getButtonsForRole = async (sessionCookie) => {
  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
  const userRole = decodedClaims.role;
  console.log("User role:", userRole);

  const buttonsForRole = roles[userRole];
  return buttonsForRole;
};
