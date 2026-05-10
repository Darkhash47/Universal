import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './views/Auth';
import { Dashboard } from './views/Dashboard';
import { Discovery } from './views/Discovery';
import { Moderation } from './views/Moderation';
import { Profile } from './views/Profile';
import { Landing } from './views/Landing';
import { News } from './views/News';
import { Missions } from './views/Missions';
import { Leaderboard } from './views/Leaderboard';
import { Teams } from './views/Teams';
import { Notifications } from './views/Notifications';
import { CyberRange } from './views/CyberRange';
import { Academy } from './views/Academy';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Shield, Zap, Terminal } from 'lucide-react';
import { cn } from './lib/utils';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-t-2 border-cyan-500 rounded-full animate-spin" />
      <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.3em]">Connecting to HQ...</span>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyan-500/30 selection:text-cyan-400">
      <div className="fixed inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      {user && <Navigation />}
      
      <div className={cn(
        "relative transition-all duration-500",
        user ? "lg:pl-72" : ""
      )}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          {user && (
            <header className="flex items-center justify-between mb-16 px-4">
              <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">Command Center</h1>
                <span className="text-[8px] font-mono tracking-[0.4em] text-white/30 uppercase">Operational Status: Nominal</span>
              </div>

              <div className="hidden md:flex items-center gap-8 text-white/20 font-mono text-[10px] uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span>Shields: Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3 h-3 text-amber-500" />
                  <span>Uplink: Secure</span>
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
            <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
            <Route path="/moderation" element={<PrivateRoute><Moderation /></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </div>
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
