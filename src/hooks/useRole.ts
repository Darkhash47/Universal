import { useAuth } from '../context/AuthContext';

export const useRole = () => {
  const { profile } = useAuth();

  const role = profile?.role || 'student';

  return {
    role,
    isAdmin: role === 'admin',
    isStudent: role === 'student',
    isCadet: role === 'student', // Mapping for legacy compat if needed
  };
};
