import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'amber' | 'ghost' | 'red';
  glow?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({ 
  children, 
  variant = 'cyan', 
  glow = false, 
  className, 
  ...props 
}) => {
  const variants = {
    cyan: 'bg-white text-black hover:bg-white/90 active:scale-[0.98]',
    amber: 'bg-amber-500 text-white hover:bg-amber-600 active:scale-[0.98]',
    red: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
    ghost: 'bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-[0.98]'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export const GlassContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(
    "bg-[#0a0a0a] border border-white/5 shadow-2xl rounded-2xl md:rounded-[2rem] p-6 md:p-10 relative overflow-hidden",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    {children}
  </div>
);

export const ClippedContainer: React.FC<{ children: React.ReactNode; className?: string; color?: 'cyan' | 'red' | 'amber' }> = ({ children, className, color = 'cyan' }) => {
  return (
    <div className={cn(
      "bg-[#0a0a0a] border border-white/5 rounded-xl relative overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
};

export const TechHeader: React.FC<{ title: string; subtitle?: string; color?: 'cyan' | 'amber' | 'red' }> = ({ title, subtitle, color = 'cyan' }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const ProgressBar: React.FC<{ progress: number; label?: string; color?: string }> = ({ progress, label, color = 'cyan' }) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-white/40">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
    )}
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn(
          "h-full rounded-full relative overflow-hidden",
          color === 'cyan' ? 'bg-cyan-500' : color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
      </motion.div>
    </div>
  </div>
);

export const SkillHex: React.FC<{ label: string; xp: number; level: number; color?: 'cyan' | 'amber' }> = ({ label, xp, level, color = 'cyan' }) => (
  <div className="group relative p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all duration-500">
     <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-black uppercase text-white/70 group-hover:text-white">{label}</h4>
        <span className={cn("text-[10px] font-bold font-mono", color === 'cyan' ? "text-cyan-400" : "text-amber-400")}>LV. {level}</span>
     </div>
     <ProgressBar progress={Math.min(100, (xp % 1000) / 10)} color={color} />
     <div className="mt-2 text-[8px] font-mono text-white/20 uppercase tracking-widest">
       XP: {xp.toLocaleString()}
     </div>
  </div>
);
