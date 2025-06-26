import React from 'react';
import { Mic, Radio, Cpu, Sparkles, AlertTriangle, Zap } from 'lucide-react';

const STATE_CONFIG = {
  LISTENING: {
    border: 'var(--amber)',
    glow: 'var(--amber-glow)',
    label: 'LISTENING',
    desc: 'Processing speech input…',
    badgeBg: 'rgba(245,158,11,0.10)',
    badgeBorder: 'rgba(245,158,11,0.45)',
    badgeText: 'var(--amber)',
    icon: Mic,
    iconAnim: 'animate-pulse',
    ringSpeed: 'animate-ring-fast',
  },
  PROCESSING: {
    border: 'var(--violet)',
    glow: 'var(--violet-glow)',
    label: 'PROCESSING',
    desc: 'AI is reasoning…',
    badgeBg: 'rgba(157,78,221,0.10)',
    badgeBorder: 'rgba(157,78,221,0.45)',
    badgeText: 'var(--violet)',
    icon: Cpu,
    iconAnim: 'animate-spin',
    ringSpeed: 'animate-ring-cw',
  },
  EXECUTING: {
    border: 'var(--emerald)',
    glow: 'var(--emerald-glow)',
    label: 'EXECUTING',
    desc: 'Running system tool…',
    badgeBg: 'rgba(16,185,129,0.10)',
    badgeBorder: 'rgba(16,185,129,0.45)',
    badgeText: 'var(--emerald)',
    icon: Sparkles,
    iconAnim: 'animate-bounce',
    ringSpeed: 'animate-ring-cw',
  },
  SPEAKING: {
    border: 'var(--cyan)',
    glow: 'var(--cyan-glow)',
    label: 'SPEAKING',
    desc: 'Streaming audio response…',
    badgeBg: 'rgba(0,229,255,0.10)',
    badgeBorder: 'rgba(0,229,255,0.45)',
    badgeText: 'var(--cyan)',
    icon: Zap,
    iconAnim: 'animate-pulse',
    ringSpeed: 'animate-ring-ccw',
  },
  ERROR: {
    border: 'var(--rose)',
    glow: 'var(--rose-glow)',
    label: 'ERROR',
    desc: 'System notice — check logs',
    badgeBg: 'rgba(244,63,94,0.10)',
    badgeBorder: 'rgba(244,63,94,0.45)',
    badgeText: 'var(--rose)',
    icon: AlertTriangle,
    iconAnim: '',
    ringSpeed: 'animate-ring-cw',
  },
};

const IDLE = {
  border: 'var(--cyan)',
  glow: 'rgba(0,229,255,0.28)',
  label: 'STANDBY',
  desc: 'Click the core or press SPACEBAR to activate voice',
  badgeBg: 'rgba(0,229,255,0.06)',
  badgeBorder: 'rgba(0,229,255,0.20)',
  badgeText: 'rgba(0,229,255,0.65)',
  icon: Radio,
  iconAnim: '',
  ringSpeed: 'animate-ring-cw',
};

export function JARVISCore({ systemState, statusMessage, onActivate }) {
  const cfg = STATE_CONFIG[systemState] ?? IDLE;
  const Icon = cfg.icon;

  return (
    <div className="hud-panel hud-panel-glow" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '28px 20px',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background radial for current state */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, ${cfg.glow.replace(')', ', 0.06)')} 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'background 0.5s',
      }} />

      {/* State Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 16px',
        borderRadius: 999,
        background: cfg.badgeBg,
        border: `1px solid ${cfg.badgeBorder}`,
        position: 'relative', zIndex: 1,
        transition: 'all 0.4s',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: cfg.border,
          boxShadow: `0 0 8px ${cfg.border}`,
          animation: 'livePing 2s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <span className="font-orbitron" style={{
          fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.16em',
          color: cfg.badgeText,
        }}>
          {cfg.label}
        </span>
      </div>

      {/* Status message */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <h2 className="font-orbitron" style={{
          fontSize: '1rem', fontWeight: 700, color: 'var(--text-hud)',
          letterSpacing: '0.06em',
        }}>
          {statusMessage}
        </h2>
        <p className="font-tech-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>
          {cfg.desc}
        </p>
      </div>

      {/* ─ REACTOR BUTTON ─ */}
      <div
        onClick={onActivate}
        style={{
          position: 'relative',
          width: 260, height: 260,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1,
        }}
      >
        {/* Degree ring labels */}
        {['000°', '090°', '180°', '270°'].map((deg, i) => {
          const pos = [
            { top: 2, left: '50%', transform: 'translateX(-50%)' },
            { right: 2, top: '50%', transform: 'translateY(-50%)' },
            { bottom: 2, left: '50%', transform: 'translateX(-50%)' },
            { left: 2, top: '50%', transform: 'translateY(-50%)' },
          ][i];
          return (
            <span key={deg} className="font-tech-mono" style={{
              position: 'absolute', fontSize: '0.52rem', color: 'rgba(0,229,255,0.3)', ...pos,
            }}>{deg}</span>
          );
        })}

        {/* Outer static compass ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid rgba(0,229,255,0.12)',
        }} />

        {/* Rotating dashed ring */}
        <div className={cfg.ringSpeed} style={{
          position: 'absolute', inset: 12, borderRadius: '50%',
          border: `2px dashed ${cfg.border}`,
          opacity: 0.65,
          transition: 'border-color 0.4s',
        }} />

        {/* Counter-rotating inner ring */}
        <div className="animate-ring-ccw" style={{
          position: 'absolute', inset: 24, borderRadius: '50%',
          border: `1px solid ${cfg.border}55`,
          opacity: 0.5,
        }} />

        {/* Another inner ring */}
        <div className="animate-ring-cw" style={{
          position: 'absolute', inset: 40, borderRadius: '50%',
          border: `1px solid ${cfg.border}33`,
          opacity: 0.35,
        }} />

        {/* Ambient glow aura */}
        <div className="animate-reactor-pulse" style={{
          position: 'absolute', inset: 52, borderRadius: '50%',
          background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 72%)`,
          transition: 'all 0.5s',
        }} />

        {/* Center reactor core */}
        <div
          style={{
            width: 130, height: 130,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, rgba(0,229,255,0.12) 0%, rgba(5,12,26,0.95) 70%)`,
            border: `2px solid ${cfg.border}`,
            boxShadow: `0 0 30px ${cfg.glow}, inset 0 0 20px ${cfg.glow}44`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.4s',
            position: 'relative',
            zIndex: 2,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {/* Hexagonal facets overlay */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'repeating-linear-gradient(60deg, transparent, transparent 8px, rgba(0,229,255,0.02) 8px, rgba(0,229,255,0.02) 9px)',
            pointerEvents: 'none',
          }} />

          <Icon
            size={38}
            color={cfg.border}
            style={{ transition: 'all 0.3s' }}
            className={cfg.iconAnim}
          />
          <span className="font-orbitron" style={{
            fontSize: '0.62rem', fontWeight: 900, color: 'rgba(0,229,255,0.9)',
            letterSpacing: '0.15em', marginTop: 6,
          }}>
            NEXA
          </span>
          <span className="font-tech-mono" style={{
            fontSize: '0.52rem', color: 'rgba(0,229,255,0.45)', letterSpacing: '0.1em',
          }}>
            [ACTIVATE]
          </span>
        </div>
      </div>

      {/* Hotkey hint */}
      <p className="font-tech-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', zIndex: 1 }}>
        PRESS{' '}
        <kbd style={{
          padding: '2px 8px', borderRadius: 4,
          background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.25)',
          color: 'var(--cyan)', fontFamily: 'inherit',
        }}>
          SPACE
        </kbd>
        {' '}TO ACTIVATE VOICE INPUT
      </p>
    </div>
  );
}
