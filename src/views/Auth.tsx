import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, signInWithGoogle } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { GlassContainer, CyberButton } from '../components/UI';
import { CyberParticles } from '../components/CyberParticles';
import { Shield, Lock, Zap, Cpu, User, Terminal as TerminalIcon, Loader2, AlertTriangle, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Auth = () => {
  const { loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'granted' | 'denied'>('idle');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setStatus('authenticating');
    setError('');
    try {
      await signInWithGoogle();
      setStatus('granted');
    } catch (err: any) {
      console.error("Google login failed:", err);
      setStatus('denied');
      setError(err.message || "GOOGLE AUTH ABORTED.");
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('authenticating');
    setError('');

    const email = `${username.trim().toLowerCase()}@universal.cyber`;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Log success
      await setDoc(doc(db, 'auth_logs', `${Date.now()}_${username}`), {
        username,
        userId: userCredential.user.uid,
        event: 'LOGIN_SUCCESS',
        timestamp: serverTimestamp()
      }).catch(() => {});

      setStatus('granted');
    } catch (err: any) {
      console.error("Auth failed:", err);
      setStatus('denied');
      
      if (err.code === 'auth/operation-not-allowed' || (err.message && err.message.includes('identitytoolkit'))) {
        setError("API DISABLED: Enable Email/Password in Firebase Console (Build -> Authentication).");
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("CREDENTIALS INVALID. ACCESS REJECTED.");
      } else {
        setError(err.message || "UPLINK ERROR. PROTOCOL ABORTED.");
      }
      
      // Log failure
      try {
        await setDoc(doc(db, 'auth_logs', `${Date.now()}_${username}`), {
          username,
          event: 'LOGIN_FAILURE',
          timestamp: serverTimestamp()
        });
      } catch (e) { /* ignore log failure */ }

      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-grid-white/[0.02] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      
      {/* Background pulses */}
      <AnimatePresence>
        {status === 'authenticating' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none"
          />
        )}
        {status === 'denied' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-500/10 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl text-center space-y-12 relative z-10"
      >
        <div className="space-y-4">
          <CyberParticles text="ACADEMY" className="h-40" />
          <p className="text-cyan-400 font-mono tracking-[0.5em] text-sm uppercase font-bold">Cyber Academy Access Point</p>
        </div>

        <GlassContainer className="p-8 md:p-12 space-y-8 relative overflow-hidden">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-white text-3xl font-black tracking-tighter uppercase italic">Authorization</h1>
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
              Level 3 Security Clearance Required
            </p>
          </div>

          <div className="space-y-4">
            <CyberButton 
              onClick={handleGoogleLogin}
              variant="ghost"
              disabled={status !== 'idle' && status !== 'denied'}
              className="w-full py-4 flex items-center justify-center gap-3 border-cyan-500/30 hover:border-cyan-400 bg-white/5"
            >
              <Chrome className="w-5 h-5 text-cyan-400" />
              <span className="font-mono text-xs tracking-widest uppercase">Sign In with Google</span>
            </CyberButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase font-mono tracking-[0.3em]">
                <span className="bg-[#0a0a0a] px-2 text-white/20">OR INTERNAL ACCESS</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-2 text-left">
                <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 ml-2">
                  <User className="w-3 h-3" /> Operative Ident
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-cyan-400 transition-colors">
                    <TerminalIcon className="w-4 h-4" />
                  </div>
                  <input
                    required
                    type="text"
                    disabled={status !== 'idle' && status !== 'denied'}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm placeholder:text-white/10"
                    placeholder="USERNAME"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                  <div className="absolute right-4 inset-y-0 flex items-center">
                    <div className="w-1.5 h-4 bg-cyan-400/20 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 text-left">
                <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 ml-2">
                  <Lock className="w-3 h-3" /> Encryption Key
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-white/20 group-focus-within:text-cyan-400 transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  <input
                    required
                    type="password"
                    disabled={status !== 'idle' && status !== 'denied'}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm placeholder:text-white/10"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Status Display */}
            <div className="h-12 flex items-center justify-center">
              {status === 'authenticating' && (
                <div className="flex items-center gap-3 text-cyan-400 font-mono text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  INITIALIZING HANDSHAKE...
                </div>
              )}
              {status === 'granted' && (
                <div className="flex items-center gap-3 text-green-400 font-mono text-xs">
                  <Zap className="w-4 h-4 animate-bounce" />
                  ACCESS GRANTED. REDIRECTING...
                </div>
              )}
              {status === 'denied' && (
                <div className="flex items-center gap-3 text-red-500 font-mono text-xs animate-shake">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <CyberButton 
              type="submit"
              disabled={status !== 'idle' && status !== 'denied'}
              className="w-full py-5 text-xl font-black uppercase tracking-[0.2em] italic"
            >
              Secure Login
            </CyberButton>
          </form>
          
          <div className="flex items-center justify-center gap-8 pt-4 border-t border-white/5 opacity-40">
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3" />
              <span className="text-[8px] uppercase font-mono tracking-widest">Core v4.0.2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] uppercase font-mono tracking-widest">Nodes Active</span>
            </div>
          </div>
        </GlassContainer>

        <div className="pt-12 flex flex-col items-center gap-6">
          <button 
            onClick={async () => {
              try {
                const res = await fetch('/api/admin/seed', { method: 'POST' });
                const data = await res.json();
                alert(data.message || data.error);
              } catch (e) { alert("Seed failed uplink."); }
            }}
            className="px-8 py-3 bg-cyan-500/20 border-2 border-cyan-500/50 rounded-xl text-cyan-400 font-mono text-xs hover:bg-cyan-500/40 hover:border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all uppercase tracking-[0.2em] font-bold"
          >
            [ INITIALIZE SYSTEM CORE ]
          </button>
          
          <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.5em]">
            Unauthorized access is strictly prohibited and monitored.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
