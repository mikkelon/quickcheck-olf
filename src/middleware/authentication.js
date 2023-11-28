import { adminDB, adminAuth } from "../config/firebase-admin.js";

export const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.__session || "";

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/web/login");
  }
};

export const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    const decodedClaims = req.user;

    if (allowedRoles.includes(decodedClaims.role)) {
      return next();
    } else {
      return res.redirect("/web/dashboard/");
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

export const webRedirect = (req, res, next) => {
  if (req.cookies.__session) {
    return res.redirect("/web/dashboard");
  } else {
    return res.redirect("/web/login");
  }
};

export const handleInvalidRoutes = (req, res, next) => {
  res.status(404).send("404 - Not found");
};
