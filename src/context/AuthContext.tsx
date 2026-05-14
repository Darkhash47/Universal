import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  isAdmin: boolean;
  isStudent: boolean;
  loading: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isStudent: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: any) => {
    setUser(userData);
    setProfile(userData);
    localStorage.setItem('cyber_auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('cyber_auth_user');
  };

  useEffect(() => {
    const stored = localStorage.getItem('cyber_auth_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
        setProfile(userData);
      } catch (e) {
        localStorage.removeItem('cyber_auth_user');
      }
    }
    setLoading(false);
  }, []);

  const isAdmin = profile?.role === 'admin';
  const isStudent = profile?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isStudent, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
