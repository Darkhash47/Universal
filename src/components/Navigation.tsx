import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../hooks/useRole';
import { auth } from '../lib/firebase';
import { 
  User, Search, ShieldCheck, LogOut, Terminal, 
  Newspaper, Target, Trophy, Users, Zap, Menu, X,
  Activity, GraduationCap, Bell
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const Navigation = () => {
  const { user } = useAuth();
  const { isAdmin, isCoordinator } = useRole();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const NavItem = ({ to, icon, label, badge }: { to: string; icon: React.ReactNode; label: string; badge?: string | number }) => (
    <NavLink
      to={to}
      onClick={() => setIsOpen(false)}
      className={({ isActive }) => cn(
        "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300",
        isActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]" : "text-white/40 hover:text-white hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "transition-transform duration-300 group-hover:scale-110",
          "text-inherit"
        )}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      {badge && (
        <span className="bg-cyan-500/20 text-cyan-400 text-[8px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">
          {badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-lg font-black text-white italic tracking-tighter uppercase group-hover:text-cyan-400 transition-colors">Universal</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.nav 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className={cn(
              "fixed top-0 left-0 h-screen w-72 z-50 p-6 flex flex-col",
              "bg-[#0d0d0d] border-r border-white/5",
              "lg:translate-x-0 pt-24 lg:pt-6",
              !isOpen && "hidden lg:flex"
            )}
          >
            {/* Logo area */}
            <div className="hidden lg:flex items-center gap-4 mb-12 px-2">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/50 rounded-xl flex items-center justify-center glow-blue">
                <Terminal className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter italic leading-none text-white">UNIVERSAL</h1>
                <span className="text-[8px] font-mono tracking-[0.3em] text-cyan-400/50 uppercase">OS v2.0.4</span>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
              <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.4em] mb-4 px-4">Core Systems</div>
              <NavItem to="/dashboard" icon={<User className="w-4 h-4" />} label="Terminal" />
              <NavItem to="/news" icon={<Newspaper className="w-4 h-4" />} label="Intel Feed" />
              <NavItem to="/notifications" icon={<Bell className="w-4 h-4" />} label="Signals" badge={3} />
              <NavItem to="/missions" icon={<Target className="w-4 h-4" />} label="Missions" />
              <NavItem to="/cyber-range" icon={<Activity className="w-4 h-4" />} label="Cyber Range" />
              <NavItem to="/academy" icon={<GraduationCap className="w-4 h-4" />} label="Academy" />
              
              <div className="pt-6 pb-2 text-[8px] font-mono text-white/20 uppercase tracking-[0.4em] px-4">Network</div>
              <NavItem to="/discovery" icon={<Search className="w-4 h-4" />} label="Operatives" />
              <NavItem to="/leaderboard" icon={<Trophy className="w-4 h-4" />} label="Rankings" />
              <NavItem to="/teams" icon={<Users className="w-4 h-4" />} label="Squads" />

              {(isAdmin || isCoordinator) && (
                <>
                  <div className="pt-6 pb-2 text-[8px] font-mono text-amber-500/30 uppercase tracking-[0.4em] px-4">Command</div>
                  <NavItem to="/moderation" icon={<ShieldCheck className="w-4 h-4 text-amber-500/70" />} label="HQ Moderation" />
                </>
              )}
            </div>

            <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
              <button
                onClick={() => auth.signOut().then(() => navigate('/'))}
                className="w-full flex items-center gap-3 px-4 py-3 text-white/30 hover:text-red-400 transition-all group overflow-hidden relative rounded-xl hover:bg-red-500/5"
              >
                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Terminate Uplink</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

