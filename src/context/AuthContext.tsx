import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: any | null;
  isAdmin: boolean;
  isCoordinator: boolean;
  isCurator: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isCoordinator: false,
  isCurator: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'ADMIN' || user?.email === 'hashmatrix.sec@gmail.com';
  const isCoordinator = profile?.role === 'COORDINATOR' || isAdmin;
  const isCurator = profile?.role === 'CURATOR' || isCoordinator;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDoc);
        
        if (!userSnap.exists()) {
          const newProfile = {
            uid: user.uid,
            displayName: user.displayName || 'Cadet',
            email: user.email,
            photoURL: user.photoURL,
            title: 'Initiate Operative',
            role: user.email === 'hashmatrix.sec@gmail.com' ? 'ADMIN' : 'CADET',
            points: 0,
            level: 1,
            bio: 'Operative data log initialized.',
            hardSkills: {},
            softSkills: {},
            achievements: [],
            experience: [],
            isVerified: false,
            teamId: null
          };
          await setDoc(userDoc, newProfile);
          setProfile(newProfile);
        } else {
          setProfile(userSnap.data());
        }

        // Listen to profile updates
        const unsubProfile = onSnapshot(userDoc, (doc) => {
          if (doc.exists()) setProfile(doc.data());
        });
        return () => unsubProfile();
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isCoordinator, isCurator, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
