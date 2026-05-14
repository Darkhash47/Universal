import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { Shield, Terminal, BadgeCheck, ChevronLeft, Edit3, Save, X } from 'lucide-react';
import { SkillTree } from '../components/SkillTree';

export const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: '',
    bio: '',
    photoURL: ''
  });

  const isOwnProfile = currentUser?.uid === id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setEditData({
            displayName: data.displayName || '',
            bio: data.bio || '',
            photoURL: data.photoURL || ''
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        ...editData,
        updatedAt: serverTimestamp()
      });
      setProfile({ ...profile, ...editData });
      setIsEditing(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${id}`);
    }
  };

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
      <div className="flex items-center justify-between">
        <CyberButton onClick={() => navigate(-1)} variant="ghost">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Return to Discovery
        </CyberButton>

        {isOwnProfile && (
          <CyberButton 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            variant={isEditing ? 'primary' : 'ghost'}
          >
            {isEditing ? (
              <><Save className="w-4 h-4 mr-2" /> Save Protocol</>
            ) : (
              <><Edit3 className="w-4 h-4 mr-2" /> Update Dossier</>
            )}
          </CyberButton>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <ClippedContainer className="p-0 overflow-hidden lg:col-span-1 border-white/5">
          <div className="h-32 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 scanlines" />
          <div className="px-8 pb-8 -mt-16 text-center">
            <div className="w-32 h-32 rounded-3xl border-4 border-[#0a0a0a] shadow-2xl overflow-hidden mx-auto mb-6 bg-[#0a0a0a] relative group">
              <img 
                src={isEditing ? editData.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${id}` : profile.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${id}`} 
                alt={profile.displayName} 
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-mono uppercase text-white/50 mb-2">Avatar URL</span>
                  <input 
                    type="text"
                    value={editData.photoURL}
                    onChange={e => setEditData({ ...editData, photoURL: e.target.value })}
                    className="w-full bg-black/80 border border-cyan-500/30 rounded px-2 py-1 text-[8px] text-white focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>
            
            {isEditing ? (
              <input 
                type="text"
                value={editData.displayName}
                onChange={e => setEditData({ ...editData, displayName: e.target.value })}
                className="w-full bg-black/40 border border-cyan-500/30 rounded px-4 py-2 text-white font-black italic uppercase tracking-tighter text-center focus:outline-none mb-2"
                placeholder="NAME"
              />
            ) : (
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none">{profile.displayName}</h2>
            )}
            
            <p className="text-cyan-400 font-mono uppercase tracking-[0.2em] text-[10px] font-bold mb-6">{profile.title || 'Cadet'}</p>
            
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
                  <span className="block text-xl font-bold text-white font-mono leading-none">{profile.role === 'admin' ? '99' : '05'}</span>
                  <span className="text-[8px] text-white/30 uppercase tracking-widest">Rank</span>
               </div>
            </div>
          </div>
        </ClippedContainer>

        {/* Data readout */}
        <div className="lg:col-span-2 space-y-8">
           <ClippedContainer className="p-8 border-white/5">
              <TechHeader title="Subject Dossier" subtitle="Biometric Summary" />
              {isEditing ? (
                <textarea 
                  value={editData.bio}
                  onChange={e => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full mt-6 bg-black/40 border border-cyan-500/30 rounded-2xl p-6 text-white/70 text-[10px] leading-relaxed font-mono focus:outline-none min-h-[120px]"
                  placeholder="Enter operative dossier information..."
                />
              ) : (
                <p className="mt-6 text-white/50 text-[10px] leading-relaxed font-mono bg-white/5 p-6 rounded-2xl border border-white/5">
                  {profile.bio || 'No public dossier information available for this entity. Access restricted.'}
                </p>
              )}
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
