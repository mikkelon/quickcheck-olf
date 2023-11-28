import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import pkg from "firebase-admin";
import { config } from "dotenv";

config();

const { FB_PROJECT_ID, FB_CLIENT_EMAIL, FB_PRIVATE_KEY } = process.env;

try {
  pkg.initializeApp({
    credential: pkg.credential.cert({
      projectId: FB_PROJECT_ID,
      clientEmail: FB_CLIENT_EMAIL,
      privateKey: FB_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
    databaseURL:
      "https://quickcheck-254b9-default-rtdb.europe-west1.firebasedatabase.app/",
  });
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export const adminDB = getFirestore();
export const adminAuth = getAuth();
export const adminRealtimeDB = getDatabase();
