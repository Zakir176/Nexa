import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Camera, Eye, CloudSun, Volume2, Mic, Copy, Check, ChevronRight } from 'lucide-react';

const SENDER_STYLE = {
  USER:   { bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)', text: 'var(--amber)',   label: '▸ YOU'  },
  NEXA:   { bg: 'rgba(0,229,255,0.08)',  border: 'rgba(0,229,255,0.25)',  text: 'var(--cyan)',    label: '◈ NEXA' },
  TOOL:   { bg: 'rgba(157,78,221,0.08)', border: 'rgba(157,78,221,0.25)', text: 'var(--violet)',  label: '⚙ TOOL' },
  VISION: { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', text: 'var(--emerald)', label: '◉ VIS'  },
  SYSTEM: { bg: 'rgba(100,116,128,0.08)',border: 'rgba(100,116,128,0.2)', text: 'var(--text-muted)', label: '◌ SYS' },
};

const QUICK_CMDS = [
  { icon: Mic,      label: 'VOICE',      action: 'voice',                 style: 'neon-btn neon-btn-amber' },
  { icon: Eye,      label: 'SCAN',       action: 'scan',                  style: 'neon-btn neon-btn-cyan'  },
  { icon: Camera,   label: 'SCREENSHOT', action: 'text:take screenshot',   style: 'neon-btn' },
  { icon: CloudSun, label: 'WEATHER',    action: 'text:get weather for London', style: 'neon-btn' },
  { icon: Volume2,  label: 'VOL +',      action: 'text:volume up',         style: 'neon-btn' },
];

export function CyberTerminal({ logs, onSendText, onTriggerScan, onActivateVoice }) {
  const [inputText, setInputText]   = useState('');
  const [copiedId, setCopiedId]     = useState(null);
  const [focused, setFocused]       = useState(false);
  const scrollRef                   = useRef(null);

  // Auto-scroll to latest log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0; // logs are prepended
    }
  }, [logs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendText(inputText);
      setInputText('');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickCmd = (action) => {
    if (action === 'voice') return onActivateVoice();
    if (action === 'scan')  return onTriggerScan();
    if (action.startsWith('text:')) return onSendText(action.slice(5));
  };

  return (
    <div className="hud-panel hud-corners hud-panel-glow" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <Terminal size={13} color="var(--cyan)" />
        <span className="hud-label" style={{ color: 'var(--cyan)' }}>TERMINAL</span>
        <span className="font-tech-mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginLeft: 2 }}>
          // REAL-TIME EVENT STREAM
        </span>
        {logs.length > 0 && (
          <span style={{
            marginLeft: 'auto',
            padding: '1px 7px',
            borderRadius: 999,
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.2)',
            color: 'var(--cyan)',
            fontSize: '0.58rem',
            fontFamily: 'Share Tech Mono, monospace',
          }}>
            {logs.length}
          </span>
        )}
      </div>

      {/* ── QUICK COMMAND CHIPS ── */}
      <div style={{
        padding: '8px 12px',
        display: 'flex', gap: 6, flexWrap: 'wrap',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        {QUICK_CMDS.map(cmd => {
          const Icon = cmd.icon;
          return (
            <button
              key={cmd.label}
              onClick={() => handleQuickCmd(cmd.action)}
              className={cmd.style || 'neon-btn neon-btn-cyan'}
              style={{ fontSize: '0.6rem', padding: '4px 10px' }}
            >
              <Icon size={11} />
              {cmd.label}
            </button>
          );
        })}
      </div>

      {/* ── LOG STREAM ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}
      >
        {logs.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 10, opacity: 0.4,
          }}>
            <Terminal size={28} color="var(--cyan)" />
            <p className="font-tech-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              SYSTEM ONLINE<br />
              <span style={{ fontSize: '0.62rem' }}>Awaiting input — speak or type a command…</span>
            </p>
          </div>
        ) : (
          logs.map((log) => {
            const style = SENDER_STYLE[log.sender] ?? SENDER_STYLE.SYSTEM;
            return (
              <div
                key={log.id}
                className="animate-fade-in"
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '7px 10px',
                  borderRadius: 6,
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                  position: 'relative',
                  transition: 'border-color 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = style.text + '55'}
                onMouseLeave={e => e.currentTarget.style.borderColor = style.border}
              >
                {/* Left accent bar */}
                <div style={{
                  width: 2, height: '100%', borderRadius: 2,
                  background: style.text,
                  flexShrink: 0, alignSelf: 'stretch',
                  opacity: 0.6,
                }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span className="font-orbitron" style={{ fontSize: '0.58rem', fontWeight: 800, color: style.text }}>
                      {style.label}
                    </span>
                    <span className="font-tech-mono" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
                      {log.time}
                    </span>
                  </div>
                  <p className="font-rajdhani" style={{
                    fontSize: '0.8rem', color: 'var(--text-hud)', lineHeight: 1.45,
                    wordBreak: 'break-word',
                  }}>
                    {log.text}
                  </p>
                </div>

                {/* Copy button */}
                <button
                  onClick={() => copyToClipboard(log.text, log.id)}
                  style={{
                    flexShrink: 0,
                    padding: 4,
                    color: copiedId === log.id ? 'var(--emerald)' : 'var(--text-dim)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'color 0.2s',
                    opacity: 0.7,
                  }}
                  title="Copy"
                >
                  {copiedId === log.id ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* ── COMMAND INPUT ── */}
      <div style={{
        padding: '10px 12px',
        borderTop: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <ChevronRight
              size={13}
              color={focused ? 'var(--cyan)' : 'var(--text-dim)'}
              style={{ position: 'absolute', left: 10, pointerEvents: 'none', transition: 'color 0.2s', flexShrink: 0 }}
            />
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Type a command…"
              className="hud-input"
              style={{ paddingLeft: 28, paddingRight: 12 }}
            />
          </div>
          <button type="submit" className="neon-btn neon-btn-primary" style={{ flexShrink: 0 }}>
            <Send size={12} />
            RUN
          </button>
        </form>
      </div>
    </div>
  );
}
