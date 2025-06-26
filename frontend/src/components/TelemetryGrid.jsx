import React from 'react';
import { Cpu, HardDrive, Eye, Radio, Zap, Activity, Layers, BarChart2 } from 'lucide-react';

const cards = [
  {
    id: 'llm',
    icon: Cpu,
    label: 'LLM CORE',
    title: 'Qwen 2.5 · Ollama',
    sub: 'Tool Calling Active',
    subColor: 'var(--emerald)',
    dot: 'var(--emerald)',
    dotPulse: true,
    accent: 'var(--cyan)',
    action: null,
  },
  {
    id: 'voice',
    icon: Radio,
    label: 'VOICE ENGINE',
    title: 'Faster-Whisper STT',
    sub: 'Edge Neural TTS',
    subColor: 'var(--cyan)',
    dot: 'var(--cyan)',
    dotPulse: false,
    accent: 'var(--cyan)',
    action: null,
  },
  {
    id: 'vision',
    icon: Eye,
    label: 'VISION RADAR',
    title: 'YOLOv8 · MediaPipe',
    sub: 'Face / Hand / Objects',
    subColor: 'var(--amber)',
    dot: 'var(--amber)',
    dotPulse: false,
    accent: 'var(--amber)',
    action: null,
  },
  {
    id: 'hw',
    icon: Activity,
    label: 'HARDWARE',
    title: 'CPU · RAM · Battery',
    sub: 'Click to Refresh →',
    subColor: 'var(--cyan)',
    dot: null,
    dotPulse: false,
    accent: 'var(--cyan)',
    action: 'get system status',
    clickable: true,
  },
];

export function TelemetryGrid({ systemState, onSendText }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
    }}>
      {cards.map(card => {
        const Icon = card.icon;
        const isActive = systemState !== 'IDLE' && systemState !== 'ERROR';
        const Tag = card.clickable ? 'button' : 'div';

        return (
          <Tag
            key={card.id}
            onClick={card.clickable ? () => onSendText(card.action) : undefined}
            className="hud-panel hud-corners"
            style={{
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              cursor: card.clickable ? 'pointer' : 'default',
              transition: 'all 0.25s',
              textAlign: 'left',
              width: '100%',
              border: '1px solid var(--border-panel)',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-panel)',
            }}
            onMouseEnter={card.clickable ? e => {
              e.currentTarget.style.borderColor = 'rgba(0,229,255,0.55)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.12)';
            } : undefined}
            onMouseLeave={card.clickable ? e => {
              e.currentTarget.style.borderColor = 'var(--border-panel)';
              e.currentTarget.style.boxShadow = 'none';
            } : undefined}
          >
            {/* Top row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={14} color={card.accent} />
                <span className="hud-label" style={{ color: card.accent }}>{card.label}</span>
              </div>
              {card.dot && (
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: card.dot,
                  boxShadow: `0 0 7px ${card.dot}`,
                  display: 'inline-block',
                  animation: card.dotPulse ? 'livePing 2s ease-in-out infinite' : undefined,
                }} />
              )}
              {card.id === 'hw' && (
                <HardDrive size={13} color="var(--text-muted)" />
              )}
            </div>

            {/* Title */}
            <div className="font-orbitron" style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-hud)', lineHeight: 1.2 }}>
              {card.title}
            </div>

            {/* Sub + mini progress bar */}
            <div>
              <div className="font-tech-mono" style={{ fontSize: '0.62rem', color: card.subColor }}>
                {card.sub}
              </div>
              <div className="neon-bar" style={{ marginTop: 6 }}>
                <div
                  className="neon-bar-fill"
                  style={{
                    width: card.id === 'llm' ? (isActive ? '85%' : '40%') :
                           card.id === 'voice' ? '60%' :
                           card.id === 'vision' ? '30%' : '75%',
                    background: `linear-gradient(90deg, ${card.accent}, ${card.accent}88)`,
                    boxShadow: `0 0 6px ${card.accent}55`,
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
            </div>
          </Tag>
        );
      })}
    </div>
  );
}
