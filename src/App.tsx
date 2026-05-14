import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './views/Auth';
import { Dashboard } from './views/Dashboard';
import { Discovery } from './views/Discovery';
import { Moderation } from './views/Moderation';
import { Profile } from './views/Profile';
import { UserManagement } from './views/UserManagement';
import { Landing } from './views/Landing';
import { News } from './views/News';
import { Missions } from './views/Missions';
import { Leaderboard } from './views/Leaderboard';
import { Teams } from './views/Teams';
import { HardSkills } from './views/HardSkills';
import { Notifications } from './views/Notifications';
import { CyberRange } from './views/CyberRange';
import { Academy } from './views/Academy';
import { Contact } from './views/Contact';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Shield, Zap, Terminal } from 'lucide-react';
import { cn } from './lib/utils';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
      <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
      <span className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">Establishing secure link</span>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
      <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
      <span className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em]">Verifying clearance</span>
    </div>
  );
  return user && isAdmin ? <>{children}</> : <Navigate to="/dashboard" />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] text-[#e2e8f0] selection:bg-white/10 selection:text-white">
      <div className="fixed inset-0 bg-grid-white opacity-[0.03] pointer-events-none" />
      
      {user && <Navigation />}
      
      <div className={cn(
        "relative transition-all duration-200",
        user ? "lg:pl-72" : ""
      )}>
        <main className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12",
          user ? "pt-24 lg:pt-12" : "py-8 md:py-16"
        )}>
          {user && (
            <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 md:mb-16 gap-4 sm:gap-0">
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-none">Command Center</h1>
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase mt-2">v4.2.0-STABLE | SECURE Uplink Established</span>
              </div>

              <div className="flex items-center gap-6 text-white/40 font-mono text-[10px] uppercase tracking-widest border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Encrypted</span>
                  <span className="sm:hidden">Secure</span>
                </div>
                <div className="w-px h-3 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Real-time</span>
                </div>
              </div>
            </header>
          )}

          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
            <Route path="/missions" element={<PrivateRoute><Missions /></PrivateRoute>} />
            <Route path="/discovery" element={<PrivateRoute><Discovery /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/cyber-range" element={<PrivateRoute><CyberRange /></PrivateRoute>} />
            <Route path="/academy" element={<PrivateRoute><Academy /></PrivateRoute>} />
            <Route path="/hard-skills" element={<PrivateRoute><HardSkills /></PrivateRoute>} />
            <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
            <Route path="/moderation" element={<AdminRoute><Moderation /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
