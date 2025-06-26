import React from 'react';
import { Mic, Radio, Cpu, Sparkles, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export function HUDCore({ systemState, statusMessage, onActivate }) {
  const getStateStyle = () => {
    switch (systemState) {
      case 'LISTENING':
        return { 
          color: '#ffb700', 
          glow: 'rgba(255, 183, 0, 0.7)', 
          text: 'LISTENING FOR VOICE', 
          bg: 'rgba(255, 183, 0, 0.1)',
          badge: 'border-amber-500 text-amber-300 bg-amber-950/80 shadow-[0_0_20px_rgba(255,183,0,0.4)]'
        };
      case 'PROCESSING':
        return { 
          color: '#b026ff', 
          glow: 'rgba(176, 38, 255, 0.7)', 
          text: 'AI PROCESSING INTENT', 
          bg: 'rgba(176, 38, 255, 0.1)',
          badge: 'border-purple-500 text-purple-300 bg-purple-950/80 shadow-[0_0_20px_rgba(176,38,255,0.4)]'
        };
      case 'EXECUTING':
        return { 
          color: '#00ffaa', 
          glow: 'rgba(0, 255, 170, 0.7)', 
          text: 'EXECUTING SYSTEM TOOL', 
          bg: 'rgba(0, 255, 170, 0.1)',
          badge: 'border-emerald-500 text-emerald-300 bg-emerald-950/80 shadow-[0_0_20px_rgba(0,255,170,0.4)]'
        };
      case 'SPEAKING':
        return { 
          color: '#00f0ff', 
          glow: 'rgba(0, 240, 255, 0.85)', 
          text: 'SPEAKING RESPONSE', 
          bg: 'rgba(0, 240, 255, 0.15)',
          badge: 'border-cyan-400 text-cyan-200 bg-cyan-950/80 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
        };
      case 'ERROR':
        return { 
          color: '#ff2a4b', 
          glow: 'rgba(255, 42, 75, 0.8)', 
          text: 'SYSTEM ERROR', 
          bg: 'rgba(255, 42, 75, 0.15)',
          badge: 'border-rose-500 text-rose-300 bg-rose-950/80 shadow-[0_0_20px_rgba(255,42,75,0.4)]'
        };
      default:
        return { 
          color: '#00f0ff', 
          glow: 'rgba(0, 240, 255, 0.4)', 
          text: 'SYSTEM STANDBY', 
          bg: 'rgba(0, 240, 255, 0.05)',
          badge: 'border-cyan-500/40 text-cyan-400 bg-slate-950/80'
        };
    }
  };

  const style = getStateStyle();

  return (
    <div className="flex flex-col items-center justify-center my-4 py-4 relative w-full">
      {/* State Status Banner */}
      <div className="mb-6 text-center z-10 flex flex-col items-center">
        <div className={`px-4 py-1.5 rounded-full border text-xs font-orbitron font-extrabold tracking-widest transition-all duration-300 flex items-center gap-2 ${style.badge}`}>
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: style.color }} />
          <span>● {style.text}</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold mt-3 text-slate-100 font-orbitron tracking-wider drop-shadow-md">
          {statusMessage}
        </h2>
      </div>

      {/* Holographic Arc Reactor Container */}
      <div 
        onClick={onActivate}
        className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center cursor-pointer group select-none"
      >
        {/* Outer Degree Compass Tick Marks */}
        <div className="absolute inset-0 rounded-full border border-cyan-900/30 flex items-center justify-center">
          <span className="absolute top-1 text-[9px] font-mono-tech text-cyan-500/60">000°</span>
          <span className="absolute bottom-1 text-[9px] font-mono-tech text-cyan-500/60">180°</span>
          <span className="absolute left-1 text-[9px] font-mono-tech text-cyan-500/60">270°</span>
          <span className="absolute right-1 text-[9px] font-mono-tech text-cyan-500/60">090°</span>
        </div>

        {/* Outer Rotating Ring 1 (Tick Marks) */}
        <div 
          className="absolute inset-4 rounded-full border-2 border-dashed animate-radar transition-all duration-700 opacity-60"
          style={{ borderColor: style.color }}
        />

        {/* Outer Counter-Rotating Ring 2 */}
        <div 
          className={`absolute inset-8 rounded-full border ${systemState === 'LISTENING' ? 'animate-radar-fast' : 'animate-radar-rev'} transition-all duration-500 opacity-40`}
          style={{ borderColor: style.color }}
        />

        {/* Ambient Pulsing Core Aura */}
        <div 
          className="absolute inset-14 rounded-full animate-core-pulse transition-all duration-700"
          style={{ 
            background: `radial-gradient(circle, ${style.glow} 0%, transparent 70%)`,
            boxShadow: `0 0 50px ${style.glow}`
          }}
        />

        {/* Center Interactive Glass Core */}
        <div 
          className="relative w-40 h-40 md:w-44 md:h-44 rounded-full hud-glass-panel flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105"
          style={{ 
            border: `2px solid ${style.color}`,
            boxShadow: `0 0 35px ${style.glow}, inset 0 0 25px ${style.glow}`
          }}
        >
          {/* Inner Glowing Icon */}
          {systemState === 'LISTENING' ? (
            <Mic className="w-14 h-14 animate-pulse" style={{ color: style.color }} />
          ) : systemState === 'PROCESSING' ? (
            <Cpu className="w-14 h-14 animate-spin" style={{ color: style.color }} />
          ) : systemState === 'EXECUTING' ? (
            <Sparkles className="w-14 h-14 animate-bounce" style={{ color: style.color }} />
          ) : systemState === 'ERROR' ? (
            <AlertTriangle className="w-14 h-14" style={{ color: style.color }} />
          ) : (
            <Radio className="w-14 h-14 transition-transform duration-300 group-hover:scale-110 text-cyan-400" />
          )}

          {/* Core Title */}
          <span className="font-orbitron text-base font-black mt-2 tracking-widest text-cyan-200">
            NEXA Core
          </span>
          <span className="text-[9px] font-mono-tech text-cyan-400/80 tracking-widest mt-0.5">
            [CLICK TO ACTIVATE]
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tech mt-5">
        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>HOTKEY: PRESS [ SPACEBAR ] ANYTIME TO SPEAK</span>
      </div>
    </div>
  );
}
