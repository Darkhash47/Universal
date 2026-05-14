import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, limit, db, handleFirestoreError, OperationType } from '../lib/firebase';
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
        <TechHeader title="Discovery" subtitle="Node Registry Analysis" />
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-medium text-sm placeholder:text-white/10 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredNodes.map((node) => (
            <Link key={node.id} to={`/profile/${node.id}`}>
              <ClippedContainer className="group hover:bg-white/[0.02] transition-all duration-300 cursor-pointer h-full border-white/10 hover:border-white/20 shadow-xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-black">
                    <img 
                      src={node.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${node.id}`} 
                      alt={node.displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors">{node.displayName}</h3>
                    <p className="text-[10px] text-white/30 font-mono font-bold uppercase tracking-wider truncate">{node.title || 'OPERATIVE'}</p>
                  </div>
                </div>

                <p className="text-white/40 text-xs md:text-[13px] line-clamp-2 font-medium leading-relaxed">
                  {node.bio || 'Credentials validated. Biography under restricted access.'}
                </p>

                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {Object.keys(node.hardSkills || {}).slice(0, 2).map((skill: string, i: number) => (
                    <span key={i} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/40 uppercase font-bold tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">LVL {node.level || 1}</span>
                   <div className="flex items-center gap-2">
                       <Eye className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
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
