import { adminDB, adminAuth } from "../config/firebase-admin.js";

export const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.__session || "";
  console.log(req.originalUrl);

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/web");
  }
};

export const authorize = allowedRoles => {
  return async (req, res, next) => {
    const decodedClaims = req.user;

    if (allowedRoles.includes(decodedClaims.role)) {
      return next();
    } else {
      return redirect("/web/dashboard/");
    }
  };
};

export const loginRedirect = (req, res, next) => {
  if (req.cookies.__session) {
    return res.redirect("/web/dashboard");
  } else {
    next();
  }
};
