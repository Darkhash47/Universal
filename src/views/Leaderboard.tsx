import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ClippedContainer, TechHeader } from '../components/UI';
import { Trophy, Medal, Target, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export const Leaderboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <TechHeader title="Global Rankings" subtitle="Elite Operative Leaderboard" />
        <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
                <span className="block text-[8px] text-white/30 uppercase tracking-[0.3em] mb-1">Active Nodes</span>
                <span className="text-xl font-bold text-white font-mono">1,248</span>
            </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {!loading && users.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mb-16">
          {/* Rank 2 */}
          <PodiumItem user={users[1]} rank={2} color="slate" />
          {/* Rank 1 */}
          <PodiumItem user={users[0]} rank={1} color="cyan" large />
          {/* Rank 3 */}
          <PodiumItem user={users[2]} rank={3} color="amber" />
        </div>
      )}

      {/* Full List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)
        ) : (
          users.slice(3).map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/profile/${user.id}`)}
              className="cursor-pointer group"
            >
              <ClippedContainer className="p-4 flex items-center gap-6 hover:border-cyan-500/30 transition-all">
                <div className="w-12 text-center font-mono font-black italic text-white/20 group-hover:text-cyan-400/50 transition-colors">
                  #{(i + 4).toString().padStart(2, '0')}
                </div>
                
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                  <img src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-black uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors">{user.displayName}</h3>
                  <p className="text-[8px] text-white/30 font-mono uppercase tracking-[0.2em]">{user.title}</p>
                </div>

                <div className="flex items-center gap-8 pr-4">
                    <div className="text-right">
                        <span className="block text-[8px] text-white/20 uppercase font-mono mb-0.5">Level</span>
                        <span className="text-sm font-bold text-white font-mono">{user.level || 1}</span>
                    </div>
                    <div className="text-right w-24">
                        <span className="block text-[8px] text-white/20 uppercase font-mono mb-0.5">Points</span>
                        <span className="text-sm font-bold text-cyan-400 font-mono">{(user.points || 0).toLocaleString()}</span>
                    </div>
                </div>
              </ClippedContainer>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const PodiumItem = ({ user, rank, color, large }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/profile/${user.id}`)}
      className={cn(
        "relative group cursor-pointer",
        rank === 1 ? "order-1 md:order-2" : rank === 2 ? "order-2 md:order-1" : "order-3"
      )}
    >
      <ClippedContainer className={cn(
        "pt-20 pb-10 text-center flex flex-col items-center gap-4 transition-all duration-500 hover:shadow-2xl",
        rank === 1 ? "border-cyan-500/50 shadow-cyan-500/10" : "border-white/10",
        large ? "scale-110 z-10" : "opacity-80 hover:opacity-100"
      )}>
        <div className={cn(
          "absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-3xl border-4 border-[#0a0a0a] overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-110",
          rank === 1 ? "border-cyan-500/30" : "border-white/10"
        )}>
          <img src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} alt="" className="w-full h-full object-cover" />
        </div>

        <div className={cn(
          "text-3xl font-black italic mb-2 font-mono flex items-center justify-center gap-2",
          rank === 1 ? "text-cyan-400 glow-blue-text" : "text-white/40"
        )}>
          {rank === 1 && <Trophy className="w-8 h-8" />}
          {rank === 2 && <Medal className="w-6 h-6" />}
          {rank === 3 && <Medal className="w-6 h-6" />}
          #{rank}
        </div>

        <div>
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{user.displayName}</h3>
          <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">{user.title}</p>
        </div>

        <div className="flex gap-6 mt-4 pt-4 border-t border-white/5 w-full justify-center">
            <div className="text-center">
              <span className="block text-[8px] text-white/30 uppercase font-mono mb-1">Level</span>
              <span className="text-sm font-bold text-white font-mono">{user.level || 1}</span>
            </div>
            <div className="text-center">
              <span className="block text-[8px] text-white/30 uppercase font-mono mb-1">XP</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{(user.points || 0).toLocaleString()}</span>
            </div>
        </div>
      </ClippedContainer>
    </motion.div>
  );
};
