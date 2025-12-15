import firebaseAdmin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as firebaseAdmin.ServiceAccount),
  databaseURL: 'https://imdb-api-3a44d-default-rtdb.firebaseio.com',
});

export const db = firebaseAdmin.firestore();
