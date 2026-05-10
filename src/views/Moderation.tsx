import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ClippedContainer, TechHeader, CyberButton } from '../components/UI';
import { ShieldCheck, Terminal, BadgeCheck, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Moderation = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'VERIFICATIONS' | 'OPERATIVES'>('VERIFICATIONS');
  const { isAdmin, user: currentUser } = useAuth();

  useEffect(() => {
    if (!isAdmin) return;
    
    const unsubVerifications = onSnapshot(query(collection(db, 'verifications'), orderBy('createdAt', 'desc')), (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubUsers = onSnapshot(query(collection(db, 'users'), limit(50)), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubVerifications();
      unsubUsers();
    };
  }, [isAdmin]);

  const handleVerify = async (requestId: string, status: 'APPROVED' | 'DENIED') => {
    try {
      await updateDoc(doc(db, 'verifications', requestId), { status });
      if (status === 'APPROVED') {
        const req = requests.find(r => r.id === requestId);
        if (req?.userId) {
          await updateDoc(doc(db, 'users', req.userId), { isVerified: true });
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `verifications/${requestId}`);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-6">
      <AlertTriangle className="w-16 h-16 text-red-500" />
      <div className="text-center">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Unauthorized Access</h2>
        <p className="text-white/30 font-mono text-xs uppercase tracking-widest mt-2">Clearance Level Insufficient</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <TechHeader title="Command Center" subtitle="High-Authority Management Suite" />
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl">
           <button 
             onClick={() => setActiveTab('VERIFICATIONS')}
             className={cn(
               "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'VERIFICATIONS' ? "bg-cyan-500 text-black" : "text-white/40 hover:text-white"
             )}
           >
             Verifications
           </button>
           <button 
             onClick={() => setActiveTab('OPERATIVES')}
             className={cn(
               "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
               activeTab === 'OPERATIVES' ? "bg-cyan-500 text-black" : "text-white/40 hover:text-white"
             )}
           >
             Operatives
           </button>
        </div>
      </div>

      {activeTab === 'VERIFICATIONS' ? (
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
          ) : requests.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
              <ShieldCheck className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em]">Queue Empty - All Protocols Nominal</p>
            </div>
          ) : (
            requests.map((req) => (
              <motion.div key={req.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <ClippedContainer className={cn(
                  "p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all",
                  req.status === 'PENDING' ? 'border-amber-500/30' : 'border-white/5 opacity-50 shadow-none'
                )}>
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border",
                      req.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-white/20'
                    )}>
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">{req.userName}</h3>
                      <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">{req.certificateName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {req.status === 'PENDING' ? (
                      <>
                        <CyberButton onClick={() => handleVerify(req.id, 'DENIED')} variant="red" className="py-2 px-4 text-xs uppercase font-black tracking-widest">
                          Reject
                        </CyberButton>
                        <CyberButton onClick={() => handleVerify(req.id, 'APPROVED')} className="py-2 px-4 text-xs uppercase font-black tracking-widest">
                          Verify
                        </CyberButton>
                      </>
                    ) : (
                      <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg border text-[10px] uppercase font-bold tracking-widest font-mono",
                        req.status === 'APPROVED' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                      )}>
                        {req.status}
                      </div>
                    )}
                  </div>
                </ClippedContainer>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
           {users.map((u) => (
             <ClippedContainer key={u.id} className="p-6 flex items-center justify-between gap-6 border-white/10">
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                      <img src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">{u.displayName}</h3>
                      <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">{u.email}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                    <select 
                      value={u.role || 'CADET'}
                      disabled={u.id === currentUser?.uid}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-500/50 appearance-none min-w-[140px]"
                    >
                        <option value="CADET">Cadet</option>
                        <option value="CURATOR">Curator</option>
                        <option value="COORDINATOR">Coordinator</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      u.isVerified ? "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]" : "bg-white/10"
                    )} title={u.isVerified ? "Verified" : "Unverified"} />
                </div>
             </ClippedContainer>
           ))}
        </div>
      )}
    </div>
  );
};
