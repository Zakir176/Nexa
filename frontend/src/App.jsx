import React, { useState, useEffect } from 'react';
import { useNexaWebSocket } from './hooks/useNexaWebSocket';
import { JARVISCore } from './components/JARVISCore';
import { SpectrumVisualizer } from './components/SpectrumVisualizer';
import { VisionOverlay } from './components/VisionOverlay';
import { CyberTerminal } from './components/CyberTerminal';
import { TelemetryGrid } from './components/TelemetryGrid';
import { Cpu, ShieldCheck, Wifi, WifiOff, Clock, Hexagon, Zap, Activity } from 'lucide-react';

export default function App() {
  const {
    connected,
    systemState,
    statusMessage,
    logs,
    scanFrame,
    scanMetadata,
    activateVoice,
    sendTextCommand,
    triggerScan,
    stopScan
  } = useNexaWebSocket();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Live HUD clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' }).toUpperCase());
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Spacebar hotkey
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        activateVoice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activateVoice]);

  return (
    <div className="select-none" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '16px 20px 12px', gap: '14px' }}>

      {/* ── TOP NAV BAR ── */}
      <header className="hud-panel hud-corners hud-panel-glow" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Logo mark */}
          <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '2px solid var(--cyan)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px var(--cyan-glow)',
              background: 'rgba(0,229,255,0.07)'
            }}>
              <Hexagon size={18} color="var(--cyan)" />
            </div>
            <span style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 10, height: 10, borderRadius: '50%',
              background: connected ? 'var(--emerald)' : 'var(--rose)',
              boxShadow: `0 0 8px ${connected ? 'var(--emerald-glow)' : 'var(--rose-glow)'}`,
              border: '1px solid var(--bg-dark)'
            }} />
          </div>

          <div>
            <h1 className="font-orbitron animate-glitch" style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--cyan)', margin: 0, lineHeight: 1 }}>
              NEXA
              <span style={{ fontSize: '0.55rem', color: 'rgba(0,229,255,0.5)', marginLeft: 8, fontWeight: 600 }}>AI PLATFORM v2.0</span>
            </h1>
            <p className="hud-label" style={{ marginTop: 2 }}>ON-DEVICE INTELLIGENCE SYSTEM</p>
          </div>
        </div>

        {/* Center metrics strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          <MetricPill label="STATE" value={systemState} accent={stateColor(systemState)} />
          <MetricPill label="MODE" value="LOCAL EDGE" accent="var(--emerald)" />
          <MetricPill label="ENGINE" value="QWEN 2.5" accent="var(--violet)" />
        </div>

        {/* Right — clock & status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="font-tech-mono" style={{ fontSize: '1rem', color: 'var(--text-hud)', fontWeight: 700 }}>{timeStr}</div>
            <div className="hud-label" style={{ fontSize: '0.58rem' }}>{dateStr}</div>
          </div>

          {connected ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.35)',
              borderRadius: 'var(--radius-sm)', color: 'var(--emerald)'
            }}>
              <span className="live-dot" />
              <span className="font-orbitron" style={{ fontSize: '0.62rem', fontWeight: 800 }}>ONLINE</span>
            </div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
              background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.35)',
              borderRadius: 'var(--radius-sm)', color: 'var(--rose)'
            }} className="animate-data-flicker">
              <WifiOff size={12} />
              <span className="font-orbitron" style={{ fontSize: '0.62rem', fontWeight: 800 }}>RECONNECTING</span>
            </div>
          )}
        </div>
      </header>

      {/* ── TELEMETRY STRIP ── */}
      <TelemetryGrid systemState={systemState} onSendText={sendTextCommand} />

      {/* ── MAIN WORKSPACE ── */}
      <main style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '14px', flex: 1, minHeight: 0 }}>
        {/* LEFT — JARVIS reactor + visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <JARVISCore
            systemState={systemState}
            statusMessage={statusMessage}
            onActivate={activateVoice}
          />
          <SpectrumVisualizer systemState={systemState} />
        </div>

        {/* RIGHT — Terminal */}
        <CyberTerminal
          logs={logs}
          onSendText={sendTextCommand}
          onTriggerScan={triggerScan}
          onActivateVoice={activateVoice}
        />
      </main>

      {/* Vision Camera Modal */}
      <VisionOverlay
        scanFrame={scanFrame}
        scanMetadata={scanMetadata}
        onClose={stopScan}
      />

      {/* ── STATUS BAR ── */}
      <footer style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px',
        borderTop: '1px solid var(--border-subtle)',
        gap: '10px', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={13} color="var(--cyan)" />
          <span className="hud-label" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>
            SECURE GATEWAY // E2E ENCRYPTION ACTIVE // PRIVACY-FIRST LOCAL PROCESSING
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <StatusDot label="LLM" active />
          <StatusDot label="STT" active />
          <StatusDot label="TTS" active />
          <StatusDot label="VISION" color="var(--amber)" />
        </div>
        <span className="hud-label" style={{ fontSize: '0.58rem', color: 'var(--text-dim)' }}>
          NEXA AI PLATFORM • LOCAL PRIVACY FIRST
        </span>
      </footer>
    </div>
  );
}

function MetricPill({ label, value, accent }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="hud-label" style={{ fontSize: '0.52rem', marginBottom: 1 }}>{label}</div>
      <div className="font-orbitron" style={{ fontSize: '0.65rem', fontWeight: 700, color: accent || 'var(--text-hud)' }}>
        {value}
      </div>
    </div>
  );
}

function StatusDot({ label, active, color }) {
  const col = color || (active ? 'var(--emerald)' : 'var(--text-dim)');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: col,
        boxShadow: active ? `0 0 5px ${col}` : 'none'
      }} />
      <span className="hud-label" style={{ fontSize: '0.54rem', color: col }}>{label}</span>
    </div>
  );
}

function stateColor(state) {
  const m = {
    LISTENING: 'var(--amber)',
    PROCESSING: 'var(--violet)',
    EXECUTING: 'var(--emerald)',
    SPEAKING: 'var(--cyan)',
    ERROR: 'var(--rose)',
  };
  return m[state] || 'var(--cyan)';
}
