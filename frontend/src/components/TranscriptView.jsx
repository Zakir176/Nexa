import React, { useRef, useEffect } from 'react';
import { User, Bot, Wrench, Sparkles, Copy, Check } from 'lucide-react';

export function TranscriptView({ logs }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-3xl clean-glass p-4 rounded-2xl max-h-72 overflow-y-auto space-y-3 my-4 scrollbar-thin"
    >
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-3 text-sm">
          {/* Avatar Icon */}
          <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
            log.sender === 'USER' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            log.sender === 'NEXA' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
            log.sender === 'TOOL' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
            'bg-slate-800 text-slate-400'
          }`}>
            {log.sender === 'USER' ? <User className="w-4 h-4" /> :
             log.sender === 'NEXA' ? <Bot className="w-4 h-4" /> :
             log.sender === 'TOOL' ? <Wrench className="w-4 h-4" /> :
             <Sparkles className="w-4 h-4" />}
          </div>

          {/* Message Content Bubble */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-300">{log.sender}</span>
              <span className="text-[10px] text-slate-500">{log.time}</span>
            </div>
            <p className="text-slate-200 leading-relaxed break-words font-sans">
              {log.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
