import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  enableIndexedDbPersistence,
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

// Advanced Firestore Initialization with Local Persistance
// solves the "Listen stream transport errored" by allowing local fallback
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Attempt to enable offline persistence for better UI experience in unstable metrics
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[UNIVERSAL OS] Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('[UNIVERSAL OS] Persistence failed: Browser not supported');
    }
  });
} catch (e) {
  // Gracefully handle errors in environments where IndexedDB might be restricted
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[UNIVERSAL OS] Neural Link Established.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("[UNIVERSAL OS] Link latency detected. Running in shadow-mode (offline).");
    }
  }
}

testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  
  if (errInfo.error.includes('insufficient permissions')) {
    console.error(`[SECURITY ALERT] Unauthorized access attempt at ${path}`);
  } else {
    console.error(`[UNIVERSAL OS] System Breach at ${path}:`, errInfo.error);
  }

  throw new Error(JSON.stringify(errInfo));
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
