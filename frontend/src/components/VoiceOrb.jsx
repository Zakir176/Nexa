import React from 'react';
import { Mic, Radio, Cpu, Sparkles, AlertCircle } from 'lucide-react';

export function VoiceOrb({ systemState, statusMessage, onActivate }) {
  const getOrbGradients = () => {
    switch (systemState) {
      case 'LISTENING':
        return {
          grad1: 'from-amber-400 via-orange-500 to-rose-500',
          aura: 'rgba(245, 158, 11, 0.4)',
          text: 'Listening...',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        };
      case 'PROCESSING':
        return {
          grad1: 'from-purple-500 via-indigo-500 to-cyan-400',
          aura: 'rgba(139, 92, 246, 0.4)',
          text: 'Thinking...',
          badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
        };
      case 'EXECUTING':
        return {
          grad1: 'from-emerald-400 via-teal-500 to-cyan-500',
          aura: 'rgba(16, 185, 129, 0.4)',
          text: 'Executing...',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        };
      case 'SPEAKING':
        return {
          grad1: 'from-cyan-400 via-blue-500 to-purple-600',
          aura: 'rgba(6, 182, 212, 0.5)',
          text: 'Speaking...',
          badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
        };
      case 'ERROR':
        return {
          grad1: 'from-rose-500 via-red-600 to-orange-500',
          aura: 'rgba(244, 63, 94, 0.5)',
          text: 'System Notice',
          badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
        };
      default:
        return {
          grad1: 'from-cyan-500 via-indigo-600 to-blue-600',
          aura: 'rgba(6, 182, 212, 0.25)',
          text: 'Ready',
          badge: 'bg-slate-800/60 text-slate-300 border-slate-700/50'
        };
    }
  };

  const orb = getOrbGradients();

  return (
    <div className="flex flex-col items-center justify-center my-8 py-4 relative w-full">
      {/* Sleek Minimalist Status Pill */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className={`px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-500 flex items-center gap-2 ${orb.badge}`}>
          <span className="w-2 h-2 rounded-full animate-ping bg-current" />
          <span>{orb.text}</span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold mt-3 text-slate-100 tracking-tight font-outfit">
          {statusMessage}
        </h2>
      </div>

      {/* Fluid Siri / Apple Intelligence Fluid Voice Orb */}
      <div 
        onClick={onActivate}
        className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center cursor-pointer group select-none"
      >
        {/* Background Multi-layer Gradient Mesh Glow */}
        <div 
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${orb.grad1} opacity-75 blur-3xl animate-fluid-mesh transition-all duration-700`}
          style={{ boxShadow: `0 0 80px ${orb.aura}` }}
        />

        {/* Dynamic Voice Aura Pulse Ring */}
        <div 
          className="absolute inset-4 rounded-full border border-white/20 animate-voice-wave transition-all duration-500"
          style={{ background: orb.aura }}
        />

        {/* Center Orb Interactive Core */}
        <div 
          className="relative w-40 h-40 md:w-44 md:h-44 rounded-full bg-slate-950/80 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105 group-active:scale-95"
        >
          {/* Inner Mesh Core Gradient Circle */}
          <div className={`absolute inset-3 rounded-full bg-gradient-to-tr ${orb.grad1} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

          {/* Center Icon */}
          <div className="relative z-10">
            {systemState === 'LISTENING' ? (
              <Mic className="w-12 h-12 text-amber-300 animate-pulse" />
            ) : systemState === 'PROCESSING' ? (
              <Cpu className="w-12 h-12 text-purple-300 animate-spin" />
            ) : systemState === 'EXECUTING' ? (
              <Sparkles className="w-12 h-12 text-emerald-300 animate-bounce" />
            ) : systemState === 'ERROR' ? (
              <AlertCircle className="w-12 h-12 text-rose-400" />
            ) : (
              <Radio className="w-12 h-12 text-cyan-300 group-hover:scale-110 transition-transform" />
            )}
          </div>

          <span className="relative z-10 font-outfit text-sm font-bold mt-2 text-slate-200 tracking-wider">
            NEXA
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-6 tracking-wide font-medium">
        Click orb or press <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]">Space</kbd> to talk
      </p>
    </div>
  );
}
