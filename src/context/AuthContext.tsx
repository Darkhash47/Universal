import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: any | null;
  isAdmin: boolean;
  isStudent: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isStudent: false,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile?.role === 'admin' || user?.email === 'hashmatrix.sec@gmail.com';
  const isStudent = profile?.role === 'student';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userDoc = doc(db, 'users', user.uid);
      
      // Create a default synthetic profile immediately so the UI can render
      const syntheticProfile = {
        uid: user.uid,
        username: user.email?.split('@')[0] || `cadet_${user.uid.slice(0, 5)}`,
        displayName: user.displayName || 'Cadet',
        email: user.email,
        role: user.email === 'hashmatrix.sec@gmail.com' ? 'admin' : 'student',
        disabled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        points: 0,
        level: 1
      };

      // Set initial loading state to false once we have at least the user object
      // This allows the app to proceed to PrivateRoutes
      // If we don't have a profile yet, we'll use the synthetic one
      
      try {
        // Try to get existing profile with a 2-second timeout
        const profilePromise = getDoc(userDoc);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 2000));
        
        const userSnap: any = await Promise.race([profilePromise, timeoutPromise]).catch(() => ({ exists: () => false }));

        if (userSnap && userSnap.exists()) {
          const data = userSnap.data();
          if (user.email === 'hashmatrix.sec@gmail.com') data.role = 'admin';
          setProfile(data);
        } else {
          // If profile doesn't exist AND it's a first time login (or timeout)
          // We set the synthetic one. 
          // If it was a timeout, the snapshot listener below will catch the real data eventually.
          setProfile(syntheticProfile);
          
          // Try to create the profile in background if it doesn't exist
          if (userSnap && !userSnap.exists()) {
             setDoc(userDoc, syntheticProfile).catch(e => console.warn("Background profile creation failed", e));
          }
        }
      } catch (err) {
        console.warn("Profile fetch failed or timed out, using fallback", err);
        setProfile(syntheticProfile);
      } finally {
        setLoading(false);
      }

      // Real-time listener for current user profile
      const unsubProfile = onSnapshot(userDoc, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (user.email === 'hashmatrix.sec@gmail.com') data.role = 'admin';
          setProfile(data);
        }
      }, (error) => {
        console.error("Profile sync error:", error);
      });

      return () => unsubProfile();
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isStudent, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
