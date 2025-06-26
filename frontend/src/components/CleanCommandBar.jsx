import React, { useState } from 'react';
import { Mic, Send, Eye, Camera, CloudSun, Activity, Sparkles } from 'lucide-react';

export function CleanCommandBar({ onSendText, onTriggerScan, onActivateVoice }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendText(text);
      setText('');
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-3 my-4">
      {/* Quick Action Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button 
          onClick={onActivateVoice}
          className="px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <Mic className="w-3.5 h-3.5" /> Listen
        </button>

        <button 
          onClick={onTriggerScan}
          className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> Vision Scan
        </button>

        <button 
          onClick={() => onSendText("take screenshot")}
          className="px-3.5 py-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <Camera className="w-3.5 h-3.5" /> Screenshot
        </button>

        <button 
          onClick={() => onSendText("get weather for London")}
          className="px-3.5 py-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <CloudSun className="w-3.5 h-3.5" /> Weather
        </button>

        <button 
          onClick={() => onSendText("get system status")}
          className="px-3.5 py-1.5 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
        >
          <Activity className="w-3.5 h-3.5" /> Hardware Stats
        </button>
      </div>

      {/* Floating Pill Input Bar */}
      <form 
        onSubmit={handleSubmit}
        className="w-full clean-glass-pill p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-cyan-500/40 transition-all"
      >
        <button 
          type="button"
          onClick={onActivateVoice}
          className="p-2.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors"
          title="Start voice input"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask Nexa anything or enter command (e.g. 'open Spotify', 'weather in Tokyo')..."
          className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-500 text-sm px-2 focus:outline-none font-sans"
        />

        <button 
          type="submit"
          disabled={!text.trim()}
          className="p-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
