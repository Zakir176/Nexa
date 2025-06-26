import React, { useEffect, useRef } from 'react';

export function AudioVisualizer({ systemState }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const isActive = systemState === 'LISTENING' || systemState === 'SPEAKING' || systemState === 'PROCESSING';
      const color = systemState === 'LISTENING' ? '#ffaa00' : systemState === 'PROCESSING' ? '#a855f7' : '#00f0ff';

      // Draw background center line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw dynamic sine wave bars
      const numBars = 36;
      const barWidth = width / numBars;

      for (let i = 0; i < numBars; i++) {
        const x = i * barWidth;
        const amplitude = isActive ? Math.sin(phase + i * 0.3) * (height * 0.4) + Math.random() * 8 : Math.sin(phase * 0.5 + i * 0.2) * 4 + 2;
        const barHeight = Math.abs(amplitude);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = isActive ? 10 : 2;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      }

      phase += isActive ? 0.15 : 0.03;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [systemState]);

  return (
    <div className="w-full max-w-lg glass-panel p-3 my-3 flex flex-col items-center">
      <div className="flex justify-between w-full text-xs text-cyan-400 orbitron mb-1 px-2">
        <span>SPECTRUM ANALYZER</span>
        <span>{systemState}</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={450} 
        height={50} 
        className="w-full h-12 rounded bg-slate-950/60 border border-cyan-900/40"
      />
    </div>
  );
}
