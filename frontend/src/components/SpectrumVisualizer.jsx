import React, { useEffect, useRef } from 'react';

const STATE_COLOR = {
  LISTENING:  { r: 245, g: 158, b: 11  },  // amber
  PROCESSING: { r: 157, g: 78,  b: 221 },  // violet
  SPEAKING:   { r: 0,   g: 229, b: 255 },  // cyan
  EXECUTING:  { r: 16,  g: 185, b: 129 },  // emerald
  ERROR:      { r: 244, g: 63,  b: 94  },  // rose
  IDLE:       { r: 0,   g: 229, b: 255 },  // cyan dim
};

function toRGBA(c, a) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

export function SpectrumVisualizer({ systemState }) {
  const canvasRef = useRef(null);
  const phaseRef  = useRef(0);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const isActive = ['LISTENING','SPEAKING','PROCESSING','EXECUTING'].includes(systemState);
    const col = STATE_COLOR[systemState] ?? STATE_COLOR.IDLE;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const phase = phaseRef.current;
      const numBars = 60;
      const barW = W / numBars;
      const maxH = H * 0.85;

      // Center guide line
      ctx.beginPath();
      ctx.strokeStyle = toRGBA(col, 0.10);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let i = 0; i < numBars; i++) {
        const x = i * barW;
        const noise = isActive ? (Math.random() * 0.25) : 0;

        const amp = isActive
          ? (Math.sin(phase + i * 0.35) * 0.55 + Math.sin(phase * 1.7 + i * 0.18) * 0.3 + noise) * maxH * 0.5 + 2
          : (Math.sin(phase * 0.4 + i * 0.22) * 0.5 + 0.5) * 4 + 1;

        const bh = Math.max(2, Math.abs(amp));
        const y  = (H - bh) / 2;

        // Bar gradient
        const grad = ctx.createLinearGradient(x, y, x, y + bh);
        grad.addColorStop(0,   toRGBA(col, 0.90));
        grad.addColorStop(0.5, toRGBA(col, 0.60));
        grad.addColorStop(1,   toRGBA(col, 0.90));

        ctx.fillStyle = grad;
        ctx.shadowColor = toRGBA(col, isActive ? 0.7 : 0.2);
        ctx.shadowBlur = isActive ? 10 : 3;
        ctx.fillRect(x + 1.5, y, barW - 3, bh);
      }

      // Peak mirror reflection (subtle)
      if (isActive) {
        ctx.save();
        ctx.globalAlpha = 0.10;
        ctx.scale(1, -0.25);
        ctx.translate(0, -(H + H * 3.8));
        for (let i = 0; i < numBars; i++) {
          const x = i * barW;
          const noise = Math.random() * 0.1;
          const amp = (Math.sin(phaseRef.current + i * 0.35) * 0.55 + noise) * maxH * 0.5 + 2;
          const bh = Math.max(2, Math.abs(amp));
          const y = (H - bh) / 2;
          ctx.fillStyle = toRGBA(col, 0.6);
          ctx.fillRect(x + 1.5, y, barW - 3, bh);
        }
        ctx.restore();
      }

      phaseRef.current += isActive ? 0.14 : 0.025;
      rafRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [systemState]);

  const isActive = ['LISTENING','SPEAKING','PROCESSING','EXECUTING'].includes(systemState);
  const col = STATE_COLOR[systemState] ?? STATE_COLOR.IDLE;

  return (
    <div className="hud-panel" style={{
      padding: '10px 14px 12px',
      background: 'var(--bg-panel)',
      border: '1px solid var(--border-panel)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="hud-label">AUDIO SPECTRUM ANALYZER</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isActive ? `rgb(${col.r},${col.g},${col.b})` : 'var(--text-dim)',
            boxShadow: isActive ? `0 0 6px rgba(${col.r},${col.g},${col.b},0.8)` : 'none',
            display: 'inline-block',
            transition: 'all 0.3s',
          }} />
          <span className="font-tech-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
            {systemState}
          </span>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={900}
          height={60}
          style={{
            width: '100%', height: 56,
            borderRadius: 6,
            background: 'rgba(2,8,20,0.70)',
            border: `1px solid rgba(${col.r},${col.g},${col.b},0.12)`,
            display: 'block',
            transition: 'border-color 0.4s',
          }}
        />
        {/* Left/right gradient fade masks */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 16,
          background: 'linear-gradient(90deg, rgba(2,8,20,0.7), transparent)',
          pointerEvents: 'none', borderRadius: '6px 0 0 6px',
        }} />
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 16,
          background: 'linear-gradient(-90deg, rgba(2,8,20,0.7), transparent)',
          pointerEvents: 'none', borderRadius: '0 6px 6px 0',
        }} />
      </div>
    </div>
  );
}
