import { adminDB, adminAuth } from "../config/firebase-admin.js";

export const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.__session || "";

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const role = decodedClaims.role;
    const url = req.originalUrl;
    // handle role based authentication

    next();
  } catch (error) {
    console.log(error);
    res.redirect("/web");
  }
};
