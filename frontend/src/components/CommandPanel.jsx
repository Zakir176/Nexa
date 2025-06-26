import React, { useState } from 'react';
import { Terminal, Send, Camera, Eye, Activity, CloudSun, Volume2, Mic, Copy, Check } from 'lucide-react';

export function CommandPanel({ logs, onSendText, onTriggerScan, onActivateVoice }) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState(null);

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

  return (
    <div className="w-full max-w-5xl hud-glass-panel hud-corners p-4 flex flex-col h-96 my-4">
      {/* Top Action & Quick Chip Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-cyan-900/60 gap-3 mb-3">
        <div className="flex items-center gap-2 text-cyan-400 font-orbitron text-xs font-bold">
          <Terminal className="w-4 h-4" />
          <span>CYBER TERMINAL // AGENT FEED</span>
        </div>

        {/* Quick Trigger Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={onActivateVoice}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 border border-amber-500/60 text-amber-300 hover:bg-amber-500 hover:text-black text-xs font-orbitron rounded font-bold transition-all shadow-[0_0_10px_rgba(255,183,0,0.2)]"
          >
            <Mic className="w-3.5 h-3.5" /> VOICE INPUT
          </button>

          <button 
            onClick={onTriggerScan}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-500 hover:text-black text-xs font-orbitron rounded font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> SCAN ROOM
          </button>

          <button 
            onClick={() => onSendText("take screenshot")}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-cyan-800 text-cyan-300 hover:border-cyan-400 text-xs font-orbitron rounded transition-all"
          >
            <Camera className="w-3.5 h-3.5" /> SCREENSHOT
          </button>

          <button 
            onClick={() => onSendText("get weather for London")}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-cyan-800 text-cyan-300 hover:border-cyan-400 text-xs font-orbitron rounded transition-all"
          >
            <CloudSun className="w-3.5 h-3.5" /> WEATHER
          </button>

          <button 
            onClick={() => onSendText("volume up")}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-cyan-800 text-cyan-300 hover:border-cyan-400 text-xs font-orbitron rounded transition-all"
          >
            <Volume2 className="w-3.5 h-3.5" /> VOLUME UP
          </button>
        </div>
      </div>

      {/* Terminal Scrollable Stream Output */}
      <div className="flex-1 overflow-y-auto space-y-2.5 font-mono-tech text-xs pr-2 mb-3">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-1">
            <Terminal className="w-8 h-8 opacity-40 text-cyan-500" />
            <p>System ready. Speak or type commands to begin...</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start justify-between gap-2 p-2 rounded bg-slate-950/60 border border-slate-900 hover:border-cyan-900/60 transition-colors group">
              <div className="flex items-start gap-2 flex-1">
                <span className="text-slate-500 text-[11px] mt-0.5">{log.time}</span>
                <span 
                  className={`font-orbitron px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.sender === 'USER' ? 'bg-amber-950/90 text-amber-300 border border-amber-600/60' :
                    log.sender === 'NEXA' ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/60' :
                    log.sender === 'TOOL' ? 'bg-purple-950/90 text-purple-300 border border-purple-600/60' :
                    'bg-slate-900 text-slate-400'
                  }`}
                >
                  {log.sender}
                </span>
                <span className="text-slate-200 text-sm flex-1 leading-relaxed">{log.text}</span>
              </div>

              <button 
                onClick={() => copyToClipboard(log.text, log.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-cyan-300 transition-opacity"
                title="Copy log text"
              >
                {copiedId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Input Command Bar */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type command (e.g. 'open browser', 'weather in London', 'take screenshot', 'volume up')..."
          className="flex-1 bg-slate-950 border border-cyan-900 focus:border-cyan-400 text-slate-100 text-sm px-4 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono-tech transition-all"
        />
        <button 
          type="submit"
          className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-orbitron rounded flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <Send className="w-4 h-4" /> EXECUTE
        </button>
      </form>
    </div>
  );
}
