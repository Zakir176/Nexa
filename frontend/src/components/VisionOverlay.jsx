import React from 'react';
import { Eye, X, Layers, Target, Scan } from 'lucide-react';

export function VisionOverlay({ scanFrame, scanMetadata, onClose }) {
  if (!scanFrame) return null;

  const count = scanMetadata?.count ?? 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(1,4,9,0.92)',
      backdropFilter: 'blur(16px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 20, gap: 14,
    }}>
      {/* HUD Header bar */}
      <div style={{
        width: '100%', maxWidth: 900,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-panel)',
        borderRadius: 'var(--radius)',
        padding: '10px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Scan size={18} color="var(--cyan)" style={{ animation: 'livePing 1.5s ease-in-out infinite' }} />
          <div>
            <div className="font-orbitron" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '0.12em' }}>
              NEXA VISION SCANNER
            </div>
            <div className="hud-label" style={{ fontSize: '0.56rem', marginTop: 1 }}>LIVE ENVIRONMENT FEED // YOLOV8 DETECTION ACTIVE</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Detection count */}
          <div style={{
            padding: '4px 12px', borderRadius: 999,
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.25)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Target size={12} color="var(--cyan)" />
            <span className="font-orbitron" style={{ fontSize: '0.65rem', color: 'var(--cyan)', fontWeight: 700 }}>
              {count} DETECTED
            </span>
          </div>

          <button
            onClick={onClose}
            className="neon-btn neon-btn-cyan"
            style={{ fontSize: '0.65rem' }}
          >
            <X size={12} /> STOP SCAN
          </button>
        </div>
      </div>

      {/* Video frame container */}
      <div style={{
        position: 'relative', maxWidth: 900, width: '100%',
        background: 'var(--bg-panel)',
        border: '2px solid rgba(0,229,255,0.45)',
        borderRadius: 'var(--radius)',
        boxShadow: '0 0 50px rgba(0,229,255,0.20), 0 0 120px rgba(0,229,255,0.05)',
        overflow: 'hidden',
      }}>
        <img
          src={scanFrame}
          alt="Vision stream"
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '68vh', objectFit: 'contain' }}
        />

        {/* Scanning line animation */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: 2,
          background: 'linear-gradient(90deg, transparent 0%, var(--cyan) 50%, transparent 100%)',
          opacity: 0.7,
          animation: 'scanLine 2.5s linear infinite',
          boxShadow: '0 0 10px var(--cyan-glow)',
        }} />

        {/* Corner brackets */}
        {[
          { top: 12, left: 12,  borderTop: '2px solid var(--cyan)', borderLeft: '2px solid var(--cyan)', borderRadius: '4px 0 0 0' },
          { top: 12, right: 12, borderTop: '2px solid var(--cyan)', borderRight: '2px solid var(--cyan)', borderRadius: '0 4px 0 0' },
          { bottom: 12, left: 12,  borderBottom: '2px solid var(--cyan)', borderLeft: '2px solid var(--cyan)', borderRadius: '0 0 0 4px' },
          { bottom: 12, right: 12, borderBottom: '2px solid var(--cyan)', borderRight: '2px solid var(--cyan)', borderRadius: '0 0 4px 0' },
        ].map((style, i) => (
          <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...style }} />
        ))}

        {/* HUD overlay info */}
        <div style={{
          position: 'absolute', top: 20, left: 20,
          background: 'rgba(2,8,20,0.80)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6, padding: '6px 12px',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
            <Layers size={11} color="var(--cyan)" />
            <span className="hud-label">RECOGNITION ACTIVE</span>
          </div>
          <div className="font-tech-mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            YOLOv8 · MediaPipe · FaceDetect
          </div>
        </div>
      </div>

      {/* Detected items */}
      {scanMetadata?.detected_items?.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
          maxWidth: 900, justifyContent: 'center',
        }}>
          {scanMetadata.detected_items.map((item, idx) => (
            <span
              key={idx}
              style={{
                padding: '4px 14px', borderRadius: 999,
                background: 'rgba(0,229,255,0.07)',
                border: '1px solid rgba(0,229,255,0.25)',
                color: 'var(--cyan)',
                display: 'flex', alignItems: 'center', gap: 5,
                animation: `fadeSlideIn 0.3s ease ${idx * 0.05}s both`,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 5px var(--cyan-glow)' }} />
              <span className="font-orbitron" style={{ fontSize: '0.6rem', fontWeight: 700 }}>{item}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
