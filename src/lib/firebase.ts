import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  doc, 
  getDocFromServer, 
  collection, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp, 
  getDoc 
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// Advanced Firestore Initialization with Local Persistence (Firestore v12+ compatible)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function testConnection() {
  try {
    const connectionDoc = doc(db, 'system', 'connection');
    await getDocFromServer(connectionDoc);
    console.log('[UNIVERSAL OS] Neural Link Established.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("[UNIVERSAL OS] Link latency detected. Running in shadow-mode (offline).");
    } else {
      // Connection might fail if the doc doesn't exist, which is fine for a test
      console.log('[UNIVERSAL OS] Primary uplink initialized.');
    }
  }
}

// testConnection(); // Removed for speed

import { handleFirestoreError as baseHandleFirestoreError, OperationType } from "../utils/handleFirestoreError";
export { OperationType };

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  return baseHandleFirestoreError(error, operationType, path, auth);
}

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("[UNIVERSAL OS] Auth sequence initialization failed", error);
    throw error;
  }
};
