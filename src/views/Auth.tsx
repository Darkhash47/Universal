import React from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../lib/firebase';
import { GlassContainer, CyberButton } from '../components/UI';
import { CyberParticles } from '../components/CyberParticles';
import { Shield, Lock, Zap, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

export const Auth = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-grid-white/[0.02]">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl text-center space-y-12"
      >
        <div className="space-y-4">
          <CyberParticles text="UNIVERSAL" className="h-40" />
          <p className="text-cyan-400 font-mono tracking-[0.5em] text-sm uppercase font-bold">Cyber Academy Access Point</p>
        </div>

        <GlassContainer className="p-12 space-y-8">
          <div className="space-y-4">
            <h1 className="text-white text-3xl font-black tracking-tighter uppercase italic">Authorization Required</h1>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto font-mono">
              Secure biometric uplink required to access the UNIVERSAL training network.
              Initialize protocol to authenticate your cadet identity node.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-8 border-y border-white/5">
            <div className="space-y-2">
              <Shield className="w-5 h-5 text-cyan-400 mx-auto" />
              <span className="block text-[8px] text-white/30 tracking-widest uppercase">ID Shield</span>
            </div>
            <div className="space-y-2 border-x border-white/5">
              <Lock className="w-5 h-5 text-amber-500 mx-auto" />
              <span className="block text-[8px] text-white/30 tracking-widest uppercase">Secure Login</span>
            </div>
            <div className="space-y-2">
              <Zap className="w-5 h-5 text-cyan-400 mx-auto" />
              <span className="block text-[8px] text-white/30 tracking-widest uppercase">Fast Auth</span>
            </div>
          </div>

          <CyberButton onClick={signInWithGoogle} className="w-full py-4 text-lg font-black uppercase tracking-widest">
            Establish Uplink
          </CyberButton>
          
          <div className="flex items-center justify-center gap-2 text-white/20">
            <Cpu className="w-4 h-4" />
            <span className="text-[10px] uppercase font-mono tracking-tighter">System Version 4.0.2 / Status: Online</span>
          </div>
        </GlassContainer>
      </motion.div>
    </div>
  );
};
