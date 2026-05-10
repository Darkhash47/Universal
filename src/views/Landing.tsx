import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Shield, Zap, Terminal, Cpu, Users, GraduationCap, 
  Target, Activity, Globe, Code, Box, Database, 
  MessageSquare, Github as GithubIcon, Disc as DiscordIcon, 
  BookOpen, Rocket, Award, Network, ChevronRight,
  Search, Eye, Lock, FileCode, Bug, Bot
} from 'lucide-react';
import { CyberParticles } from '../components/CyberParticles';
import { CyberButton, ClippedContainer, TechHeader } from '../components/UI';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  return (
    <div className="relative">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <motion.div style={{ opacity, scale }} className="text-center space-y-8 z-10">
          <CyberParticles text="UNIVERSAL" className="h-64 scale-150" />
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter glow-blue">
              Educational & Practical Cybersecurity Platform
            </h2>
            <p className="max-w-2xl mx-auto text-white/50 text-sm md:text-lg leading-relaxed font-mono tracking-wide px-6">
              Advanced training node for the next generation of cybersecurity operatives. 
              Master the art of defense and offense through high-fidelity simulations.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
            <CyberButton onClick={() => user ? navigate('/dashboard') : navigate('/auth')} className="px-10 py-4 text-xl">
              <Rocket className="w-5 h-5" />
              Join Project
            </CyberButton>
            <CyberButton variant="ghost" className="px-10 py-4 text-xl border-white/20">
              <Target className="w-5 h-5" />
              Explore Directions
            </CyberButton>
          </div>
        </motion.div>

        {/* Decorative background grid */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
      </section>

      {/* 2. About Project */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <TechHeader title="Protocol Vision" subtitle="The Academy Mission" />
            <div className="space-y-6 text-white/60 text-lg leading-relaxed">
              <p>
                UNIVERSAL is more than just a course; it's a living ecosystem where education meets real-world tactical operations. 
                We bridge the gap between theoretical knowledge and field expertise.
              </p>
              <p className="border-l-2 border-cyan-500/50 pl-6 italic">
                "In the digital domain, silence is security. Proficiency is survival."
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="block text-cyan-400 font-bold mb-1">Practical 1st</span>
                  <span className="text-xs">Real-world cases & live environments.</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="block text-amber-400 font-bold mb-1">Collaboration</span>
                  <span className="text-xs">Squad-based learning & research.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full" />
            <ClippedContainer className="p-8 aspect-video flex items-center justify-center group overflow-hidden">
                <div className="grid grid-cols-8 gap-1 opacity-20">
                    {Array.from({ length: 64 }).map((_, i) => (
                        <div key={i} className="w-full aspect-square bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors duration-500" />
                    ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-24 h-24 text-cyan-400 transition-transform group-hover:scale-110 duration-500" />
                </div>
            </ClippedContainer>
          </div>
        </div>
      </section>

      {/* 3. Directions / Teams */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <TechHeader title="Operational Units" subtitle="Choose your specialization" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DirectionCard 
              icon={<Target className="text-red-400" />}
              title="Red Team"
              desc="Offensive security and penetration testing logic. Break the perimeter."
              color="red"
            />
            <DirectionCard 
              icon={<Shield className="text-cyan-400" />}
              title="Blue Team"
              desc="Defensive infrastructure and incident response. Secure the node."
              color="cyan"
            />
            <DirectionCard 
              icon={<Search className="text-amber-400" />}
              title="OSINT"
              desc="Intelligence gathering and social engineering research."
              color="amber"
            />
            <DirectionCard 
              icon={<Lock className="text-purple-400" />}
              title="Cryptography"
              desc="Modern encryption protocols and mathematical defense."
              color="ghost"
            />
            <DirectionCard 
              icon={<Eye className="text-green-400" />}
              title="Digital Forensics"
              desc="Evidence extraction and digital footprint analysis."
              color="ghost"
            />
            <DirectionCard 
              icon={<Bug className="text-orange-400" />}
              title="Malware Analysis"
              desc="Deconstruction of advanced persistent threats."
              color="ghost"
            />
          </div>
        </div>
      </section>

      {/* 4. Practical Activities */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <TechHeader title="Combat Operations" subtitle="Field Exercises" />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivityItem 
            title="CTF Competitions" 
            desc="Weekly Jeopardy and Attack-Defense style events." 
            icon={<Award />}
          />
          <ActivityItem 
            title="Cyber Exercises" 
            desc="Full-scale infrastructure penetration simulations." 
            icon={<Activity />}
          />
          <ActivityItem 
            title="Knowledge Base" 
            desc="Deep-dive write-ups from real-world investigations." 
            icon={<BookOpen />}
          />
          <ActivityItem 
            title="Virtual Labs" 
            desc="Isolated sandboxes for safe exploit testing." 
            icon={<Cpu />}
          />
        </div>
      </section>

      {/* 5. Infrastructure */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-900/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-16 relative">
          <div className="flex items-end justify-between">
            <TechHeader title="System Architecture" subtitle="Infrastructure Overview" />
            <div className="hidden lg:block h-px flex-1 mx-12 bg-white/10" />
            <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-[10px] font-mono uppercase tracking-widest">
              State: Balanced
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <InfraNode icon={<DiscordIcon />} label="Discord Hub" desc="Communication Channel" />
            <InfraNode icon={<GraduationCap />} label="LMS Node" desc="Learning Management" />
            <InfraNode icon={<GithubIcon />} label="Codebase" desc="Resource Repository" />
            <InfraNode icon={<Box />} label="Polygon" desc="Cyber Exercise Arena" />
            <InfraNode icon={<Database />} label="Vault" desc="Asset Secret Storage" />
          </div>
        </div>
      </section>

      {/* 6. Learning System */}
      <section className="py-32 px-6 max-w-7xl mx-auto bg-white/5 rounded-[4rem] border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-8 md:p-16">
          <div className="space-y-6">
            <TechHeader title="Career Path" subtitle="Operative Progression" />
            <p className="text-white/40 text-sm leading-relaxed">
              Our structured curriculum guides you from the fundamental logic of networking to advanced red teaming.
            </p>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <ProgressStep level="01" title="Cadet" desc="Mastering Linux, Networking, and Basic Scripting." />
            <ProgressStep level="02" title="Operative" desc="Active participation in labs and team exercises." />
            <ProgressStep level="03" title="Specialist" desc="Expertise in a chosen direction and research lead." />
          </div>
        </div>
      </section>

      {/* 7. Statistics Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value="1,024" label="Participants" />
          <Stat value="128" label="Virtual Labs" />
          <Stat value="42" label="Global CTFs" />
          <Stat value="512" label="Write-ups" />
        </div>
      </section>

      {/* 9. Join Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          <TechHeader title="Initialize Connection" subtitle="Recruitment Open" />
          <ClippedContainer className="p-12 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Nickname" className="bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                <select className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none">
                    <option>Select Direction</option>
                    <option>Red Team</option>
                    <option>Blue Team</option>
                    <option>OSINT</option>
                </select>
             </div>
             <textarea placeholder="Tell us about your motivation..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-cyan-500 h-32" />
             <CyberButton className="w-full py-4 uppercase font-black tracking-widest text-lg">Transmit Application</CyberButton>
          </ClippedContainer>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Zap className="text-cyan-400" />
            <span className="font-bold tracking-tighter uppercase italic">UNIVERSAL</span>
          </div>
          <div className="flex gap-8 text-white/40 text-xs uppercase font-mono tracking-widest">
            <a href="#" className="hover:text-cyan-400">Github</a>
            <a href="#" className="hover:text-cyan-400">Discord</a>
            <a href="#" className="hover:text-cyan-400">System Status</a>
          </div>
          <p className="text-[10px] text-white/20 uppercase tracking-tighter">© 2026 Universal Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const DirectionCard = ({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: any }) => (
  <motion.div whileHover={{ y: -5 }} className="group">
    <ClippedContainer color={color} className="p-8 h-full space-y-4 hover:bg-white/[0.07] transition-colors">
      <div className="bg-white/5 p-4 w-fit rounded-2xl group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
      </div>
      <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
      <div className="pt-4 flex items-center text-[10px] uppercase font-bold text-cyan-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Initialize Protocol <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </ClippedContainer>
  </motion.div>
);

const ActivityItem = ({ title, desc, icon }: { title: string, desc: string, icon: any }) => (
  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-6 hover:border-white/30 transition-colors group">
    <div className="bg-cyan-500/10 p-4 rounded-xl text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors shrink-0 h-fit">
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    </div>
    <div className="space-y-1">
      <h4 className="text-white font-bold">{title}</h4>
      <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
    </div>
  </div>
);

const InfraNode = ({ icon, label, desc }: { icon: any, label: string, desc: string }) => (
  <div className="text-center group p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
    <div className="mx-auto w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-all mb-4">
      {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
    </div>
    <h5 className="text-xs font-bold text-white uppercase tracking-tighter mb-1">{label}</h5>
    <p className="text-[10px] text-white/30 uppercase tracking-widest">{desc}</p>
  </div>
);

const ProgressStep = ({ level, title, desc }: { level: string, title: string, desc: string }) => (
  <div className="group relative flex items-center gap-8 p-6 lg:p-8 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
    <div className="text-4xl lg:text-6xl font-black text-white/10 italic group-hover:text-cyan-500/20 transition-colors">{level}</div>
    <div className="space-y-1">
      <h4 className="text-xl font-bold text-white uppercase italic">{title}</h4>
      <p className="text-white/40 text-xs tracking-wide">{desc}</p>
    </div>
    <ChevronRight className="ml-auto w-6 h-6 text-white/10 group-hover:text-cyan-400 transition-colors" />
  </div>
);

const Stat = ({ value, label }: { value: string, label: string }) => (
  <div className="text-center space-y-1 group">
    <div className="text-3xl md:text-5xl font-black text-white italic group-hover:glow-blue transition-all">{value}</div>
    <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase">{label}</div>
  </div>
);
