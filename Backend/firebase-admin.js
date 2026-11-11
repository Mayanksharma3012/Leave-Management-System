
import { cert, initializeApp } from "firebase-admin/app";

const serviceAccount = JSON.parse(
  Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    "base64"
  ).toString("utf8")
);

const app = initializeApp({
  credential: cert(serviceAccount),
});

export default app;
