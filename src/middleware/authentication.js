import { adminDB, adminAuth } from "../config/firebase-admin.js";

export const authenticate = async (req, res, next) => {
  const sessionCookie = req.cookies.__session || "";

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    req.user = decodedClaims;
    next();
  } catch (error) {
    console.log("Error authenticating user from session cookie");
    console.log("Redirecting to /web/login");
    res.redirect("/web/login");
  }
};

export const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    const decodedClaims = req.user;

    if (
      allowedRoles.includes(decodedClaims.role) ||
      decodedClaims.role === "test" // <--- TODO: Remove test role
    ) {
      return next();
    } else {
      console.log("User does not have permission to access this endpoint");
      console.log("Redirecting to /web/dashboard");
      return res.redirect("/web/dashboard/");
    }
  };
};

export const loginRedirect = (req, res, next) => {
  if (req.cookies.__session) {
    console.log("User is already logged in");
    console.log("Redirecting to /web/dashboard");
    return res.redirect("/web/dashboard");
  } else {
    next();
  }
};

export const webRedirect = (req, res, next) => {
  if (req.cookies.__session) {
    console.log("User is already logged in");
    console.log("Redirecting to /web/dashboard");
    return res.redirect("/web/dashboard");
  } else {
    console.log("User is not logged in");
    console.log("Redirecting to /web/login");
    return res.redirect("/web/login");
  }
};

export const handleInvalidRoutes = (req, res, next) => {
  res.status(404).send("404 - Not found");
};
