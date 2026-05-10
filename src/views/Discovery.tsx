import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ClippedContainer, TechHeader } from '../components/UI';
import { Search, Eye, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Discovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, limit(20));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        setNodes(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'users');
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const filteredNodes = nodes.filter(node => 
    node.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.keys(node.hardSkills || {}).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <TechHeader title="Operative Directory" subtitle="Intel Network Pulse - Global Scan" />
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Scan for display names or skill tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-mono text-[10px] placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all shadow-2xl"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white/5 border border-white/5 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNodes.map((node) => (
            <Link key={node.id} to={`/profile/${node.id}`}>
              <ClippedContainer className="group hover:bg-cyan-500/[0.02] transition-all duration-500 cursor-pointer h-full border-white/10 hover:border-cyan-500/50 shadow-2xl">
                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg bg-[#0a0a0a]">
                        <img 
                          src={node.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${node.id}`} 
                          alt={node.displayName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a0a] shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter truncate transition-colors group-hover:text-cyan-400">{node.displayName}</h3>
                      <p className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-widest truncate">{node.title}</p>
                    </div>
                  </div>

                  <p className="text-white/30 text-[10px] line-clamp-2 font-mono h-8 leading-relaxed">
                    {node.bio || 'Operative log initialization complete. Background pending decryption.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 min-h-[44px]">
                    {Object.keys(node.hardSkills || {}).slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-[8px] bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-white/50 uppercase font-mono tracking-widest group-hover:border-cyan-500/30 group-hover:text-cyan-400/70 transition-all">
                        {skill}
                      </span>
                    ))}
                    {Object.keys(node.hardSkills || {}).length > 3 && (
                      <span className="text-[8px] text-white/20 px-2 py-1 flex items-center">+{Object.keys(node.hardSkills || {}).length - 3}</span>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.4em]">RANK: {node.role || 'CADET'}</span>
                     <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-white pr-2 border-r border-white/10">LVL {node.level || 1}</span>
                         <Eye className="w-4 h-4 text-white/10 group-hover:text-cyan-400 transition-colors ml-2" />
                     </div>
                  </div>
                </div>
              </ClippedContainer>
            </Link>
          ))}
        </div>
      )}

      {filteredNodes.length === 0 && !loading && (
        <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/5">
          <Terminal className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em]">No matching entities found in global directory</p>
        </div>
      )}
    </div>
  );
};
