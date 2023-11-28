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
};
const roles = {
  admin: [
    buttons.createEmployee,
    buttons.createFamily,
    buttons.studentOverview,
  ],
  employee: [buttons.studentOverview],
  parents: [buttons.myChildren],
};

export const getButtonsForRole = async (sessionCookie) => {
  const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
  const userRole = decodedClaims.role;

  const buttonsForRole = roles[userRole];
  return buttonsForRole;
};
