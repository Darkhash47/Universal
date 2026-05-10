import { useAuth } from '../context/AuthContext';

export const useRole = () => {
  const { profile } = useAuth();

  const role = profile?.role || 'CADET';

  return {
    role,
    isAdmin: role === 'ADMIN',
    isCoordinator: role === 'COORDINATOR' || role === 'ADMIN',
    isCurator: role === 'CURATOR' || role === 'COORDINATOR' || role === 'ADMIN',
    isCadet: true,
  };
};
