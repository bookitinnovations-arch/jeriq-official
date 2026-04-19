import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Using initializeFirestore instead of getFirestore to enable architectural resilience
// experimentalForceLongPolling is often required in sandboxed or high-security network environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Critical: Call getFromServer to test the connection on boot
export async function testFirestoreConnection() {
  try {
    // Attempting a direct server fetch to verify the sovereign data link
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection verified [IYOO].");
  } catch (error: any) {
    console.error("Firestore connection failure:", {
      code: error?.code,
      message: error?.message,
      databaseId: firebaseConfig.firestoreDatabaseId
    });

    if (error?.code === 'unavailable' || (error instanceof Error && error.message.includes('the client is offline'))) {
      console.error("CRITICAL: Could not reach Cloud Firestore backend. Please verify your project configuration in firebase-applet-config.json or re-run the Firebase setup.");
    }
  }
}
