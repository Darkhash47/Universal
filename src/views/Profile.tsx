import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { Shield, Terminal, BadgeCheck, ChevronLeft } from 'lucide-react';
import { SkillTree } from '../components/SkillTree';

export const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-12 h-12 border-t-2 border-cyan-500 rounded-full animate-spin" />
      <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest">Accessing Node...</span>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-20 space-y-6">
      <Shield className="w-16 h-16 text-red-500 mx-auto opacity-20" />
      <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Access Denied</h2>
      <p className="text-white/30 font-mono text-xs uppercase tracking-widest">Entity not found in global directory</p>
      <CyberButton onClick={() => navigate('/discovery')} variant="ghost">Return to Discovery</CyberButton>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <CyberButton onClick={() => navigate(-1)} variant="ghost" className="mb-4">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Return to Discovery
      </CyberButton>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <ClippedContainer className="p-0 overflow-hidden lg:col-span-1 border-white/5">
          <div className="h-32 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 scanlines" />
          <div className="px-8 pb-8 -mt-16 text-center">
            <div className="w-32 h-32 rounded-3xl border-4 border-[#0a0a0a] shadow-2xl overflow-hidden mx-auto mb-6 bg-[#0a0a0a]">
              <img 
                src={profile.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`} 
                alt={profile.displayName} 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none">{profile.displayName}</h2>
            <p className="text-cyan-400 font-mono uppercase tracking-[0.2em] text-[10px] font-bold mb-6">{profile.title}</p>
            
            <div className="flex justify-center gap-4 border-t border-white/5 pt-6">
               <div className="text-center">
                  <span className="block text-xl font-bold text-white font-mono leading-none">{profile.level || 1}</span>
                  <span className="text-[8px] text-white/30 uppercase tracking-widest">Level</span>
               </div>
               <div className="w-px h-8 bg-white/5" />
               <div className="text-center">
                  <span className="block text-xl font-bold text-white font-mono leading-none">{(profile.points || 0).toLocaleString()}</span>
                  <span className="text-[8px] text-white/30 uppercase tracking-widest">Points</span>
               </div>
               <div className="w-px h-8 bg-white/5" />
               <div className="text-center">
                  <span className="block text-xl font-bold text-white font-mono leading-none">{profile.role === 'ADMIN' ? '99' : '05'}</span>
                  <span className="text-[8px] text-white/30 uppercase tracking-widest">Rank</span>
               </div>
            </div>
          </div>
        </ClippedContainer>

        {/* Data readout */}
        <div className="lg:col-span-2 space-y-8">
           <ClippedContainer className="p-8 border-white/5">
              <TechHeader title="Subject Dossier" subtitle="Biometric Summary" />
              <p className="mt-6 text-white/50 text-[10px] leading-relaxed font-mono bg-white/5 p-6 rounded-2xl border border-white/5">
                {profile.bio || 'No public dossier information available for this entity. Access restricted.'}
              </p>
           </ClippedContainer>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ClippedContainer className="p-8 border-white/5">
                  <TechHeader title="Neural Core" subtitle="Interactive Skill Tree" />
                  <div className="mt-8">
                    <SkillTree 
                      skills={Object.keys(profile.hardSkills || {})} 
                      experience={profile.experience || []}
                      isVerified={profile.isVerified}
                    />
                  </div>
              </ClippedContainer>

              <ClippedContainer className="p-8 border-white/5" color="amber">
                  <TechHeader title="Verification" subtitle="Active Protocols" color="amber" />
                  <div className="mt-8 space-y-3">
                     <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                           <Shield className="w-4 h-4 text-cyan-400" />
                           <span className="text-[10px] font-mono uppercase text-white/70">Protocol Alpha</span>
                        </div>
                        <BadgeCheck className="w-4 h-4 text-cyan-400 glow-blue text-[8px]" />
                     </div>
                     {profile.isVerified && (
                        <div className="flex items-center justify-between p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-4 h-4 text-cyan-400" />
                                <span className="text-[10px] font-mono uppercase text-cyan-400">Security Clearance</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
                        </div>
                     )}
                  </div>
              </ClippedContainer>
           </div>
        </div>
      </div>
    </div>
  );
};
