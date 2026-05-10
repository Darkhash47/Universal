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
  glow = true, 
  className, 
  ...props 
}) => {
  const variants = {
    cyan: 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 active:scale-95',
    amber: 'bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20 active:scale-95',
    red: 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20 active:scale-95',
    ghost: 'bg-transparent border-white/10 text-white/70 hover:bg-white/5 active:scale-95'
  };

  const glows = {
    cyan: 'shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    amber: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    red: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    ghost: ''
  };

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-6 py-2 border rounded-xl font-medium transition-all duration-300 backdrop-blur-md relative overflow-hidden group',
        variants[variant],
        glow && glows[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export const GlassContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn(
    "bg-white/5 border border-white/10 backdrop-blur-xl rounded-[3.5rem] p-8 shadow-2xl relative overflow-hidden",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    {children}
  </div>
);

export const ClippedContainer: React.FC<{ children: React.ReactNode; className?: string; color?: 'cyan' | 'red' | 'amber' }> = ({ children, className, color = 'cyan' }) => {
  const borderColors = {
    cyan: 'border-cyan-500/30',
    red: 'border-red-500/30',
    amber: 'border-amber-500/30'
  };
  
  return (
    <div className={cn(
      "clipped bg-white/5 border backdrop-blur-md relative overflow-hidden",
      borderColors[color],
      className
    )}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

export const TechHeader: React.FC<{ title: string; subtitle?: string; color?: 'cyan' | 'amber' | 'red' }> = ({ title, subtitle, color = 'cyan' }) => {
  const textColors = {
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    red: 'text-red-400'
  };
  
  return (
    <div className="space-y-1">
      <h2 className={cn("text-3xl font-black tracking-tighter uppercase italic", textColors[color])}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase">
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
