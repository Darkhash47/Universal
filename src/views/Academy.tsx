import React from 'react';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { BookOpen, GraduationCap, Code, Shield, Terminal, Search, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 't1',
    title: 'Red Team Ops',
    subtitle: 'Offensive Security & Pentesting',
    icon: <Terminal className="w-6 h-6" />,
    courses: 12,
    students: 1420,
    progress: 45
  },
  {
    id: 't2',
    title: 'Defensive Sync',
    subtitle: 'SOC Operations & Hardening',
    icon: <Shield className="w-6 h-6" />,
    courses: 8,
    students: 3200,
    progress: 10
  },
  {
    id: 't3',
    title: 'Neural Dev',
    subtitle: 'Cyber-Safe Architecture',
    icon: <Code className="w-6 h-6" />,
    courses: 15,
    students: 890,
    progress: 0
  }
];

export const Academy = () => {
  return (
    <div className="space-y-16 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <TechHeader title="Operative Academy" subtitle="Knowledge Synthesis Core" />
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input 
            placeholder="Search curricula nodes..." 
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-[10px] placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TRACKS.map((track) => (
          <motion.div key={track.id} whileHover={{ scale: 1.02 }} className="group">
            <ClippedContainer className="p-8 border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                  {track.icon}
                </div>
                <div className="text-right">
                   <span className="block text-2xl font-black italic text-white italic leading-none">{track.courses}</span>
                   <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Curricula</span>
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">{track.title}</h3>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{track.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${track.progress}%` }}
                    className="h-full bg-cyan-500" 
                  />
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.2em]">
                  <span className="text-white/30">Synchronization</span>
                  <span className="text-cyan-400">{track.progress}%</span>
                </div>
              </div>

              <CyberButton className="w-full mt-8 py-4 text-[10px] uppercase font-black tracking-widest">
                Access Curriculm
              </CyberButton>
            </ClippedContainer>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <TechHeader title="Upcoming Seminars" subtitle="Live Educational Synapse" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center justify-between group hover:border-cyan-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-6">
                  <div className="text-center py-2 px-4 border-r border-white/10">
                    <span className="block text-xl font-black text-white italic font-mono leading-none">2{i}</span>
                    <span className="text-[8px] text-white/30 uppercase tracking-widest">MAY</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Advanced Malware Obfuscation</h4>
                    <p className="text-[10px] text-white/40 font-mono">Lead Instructor: <span className="text-cyan-400">V.X.0</span></p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-cyan-400 transition-all" />
              </div>
            ))}
          </div>
        </div>

        <ClippedContainer className="p-12 border-white/5 flex flex-col justify-center items-center text-center space-y-8">
           <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-black">
              <GraduationCap className="w-10 h-10" />
           </div>
           <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Certification Portal</h3>
              <p className="text-[10px] text-white/40 font-mono tracking-widest max-w-sm">
                Validate your hard-skills and receive cryptographically signed certificates recognized by the Central Intelligence Collective.
              </p>
           </div>
           <CyberButton variant="ghost" className="uppercase tracking-[0.4em] font-black py-4">
              Review Requirements
           </CyberButton>
        </ClippedContainer>
      </div>
    </div>
  );
};
