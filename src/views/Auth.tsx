import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassContainer, CyberButton } from '../components/UI';
import { CyberParticles } from '../components/CyberParticles';
import { Shield, Lock, User, Terminal as TerminalIcon, Loader2, AlertTriangle, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const { loading, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'granted' | 'denied'>('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('authenticating');
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('granted');
        setTimeout(() => {
          login(data.user);
          navigate('/dashboard');
        }, 800);
      } else {
        throw new Error(data.error || 'ACCESS_DENIED');
      }
    } catch (err: any) {
      setStatus('denied');
      setError(err.message || "UPLINK ERROR");
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-20" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/30 hover:text-white transition-colors group z-20"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Return</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">Security Node Alpha</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">
            PROTOCOL
          </h1>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em]">Institutional Access Point</p>
        </div>

        <GlassContainer className="rounded-2xl md:rounded-3xl border border-white/10 p-6 md:p-8 bg-black/60 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">
                  Identity
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    required
                    type="text"
                    disabled={status === 'authenticating' || status === 'granted'}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all font-medium"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">
                  Private Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    required
                    type="password"
                    disabled={status === 'authenticating' || status === 'granted'}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="h-4 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {status === 'authenticating' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-white/40 text-[10px] font-mono"
                  >
                    <Loader2 className="w-3 h-3 animate-spin" />
                    VERIFYING CREDENTIALS...
                  </motion.div>
                )}
                {status === 'denied' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-500 text-[10px] font-mono font-bold"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <CyberButton 
              type="submit"
              disabled={status === 'authenticating' || status === 'granted'}
              className="w-full py-4 text-sm tracking-widest"
            >
              {status === 'granted' ? 'SUCCESS' : 'AUTHORIZE'}
            </CyberButton>
          </form>
        </GlassContainer>

        <div className="mt-8 text-center opacity-20 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[10px] font-mono text-white tracking-[0.2em]">© 2026 ACADEMY DEFENSE SYSTEMS</p>
        </div>
      </motion.div>
    </div>
  );
};
