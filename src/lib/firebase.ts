// Mock Firebase for Design-only mode
export const db: any = {
  collection: (path: string) => ({
    path,
    doc: (docId: string) => ({
      path: `${path}/${docId}`,
      id: docId,
      get: async () => ({ exists: () => false, data: () => null }),
      set: async () => {},
      update: async () => {},
      delete: async () => {},
      onSnapshot: (callback: any) => {
        callback({ exists: () => false, data: () => null });
        return () => {};
      },
    }),
    where: () => db.collection(path),
    orderBy: () => db.collection(path),
    limit: () => db.collection(path),
    get: async () => ({ docs: [] }),
    onSnapshot: (callback: any) => {
      callback({ docs: [] });
      return () => {};
    },
  }),
};

export const collection = (firestore: any, path: string) => {
  if (firestore?.collection) return firestore.collection(path);
  return db.collection(path);
};

export const query = (ref: any, ...constraints: any[]) => ref;
export const orderBy = (...args: any[]) => ({ type: 'orderBy', args });
export const where = (...args: any[]) => ({ type: 'where', args });
export const limit = (...args: any[]) => ({ type: 'limit', args });
export const onSnapshot = (ref: any, onNext: any, onError?: any) => {
  if (ref?.onSnapshot) return ref.onSnapshot(onNext);
  return () => {};
};

export const getDocs = async (ref: any) => {
  if (ref?.get) return ref.get();
  return { docs: [] };
};

export const getDoc = async (ref: any) => {
  if (ref?.get) return ref.get();
  return { exists: () => false, data: () => null };
};

export const addDoc = async (ref: any, data: any) => {
  return { id: 'mock-id' };
};

export const setDoc = async (ref: any, data: any) => {
  return;
};

export const updateDoc = async (ref: any, data: any) => {
  return;
};

export const deleteDoc = async (ref: any) => {
  return;
};

export const serverTimestamp = () => new Date();

export const auth: any = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {
    callback(null);
    return () => {};
  },
  signInWithEmailAndPassword: async () => { throw new Error("Firebase Disabled") },
  signOut: async () => {},
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export const doc = (firestore: any, path: string, ...rest: any[]) => {
  if (firestore?.doc) return firestore.doc(path, ...rest);
  const segments = path.split('/');
  const colPath = segments.slice(0, -1).join('/');
  const docId = segments[segments.length - 1];
  return db.collection(colPath).doc(docId);
};

export function handleFirestoreError(error: any, operation?: string, path?: string) {
  console.error(`Firestore Error [${operation}] at [${path}]:`, error);
}

export const testConnection = async () => {};
