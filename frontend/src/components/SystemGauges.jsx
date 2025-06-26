import React from 'react';
import { Cpu, HardDrive, BatteryCharging, Shield, Activity, Radio, Sparkles } from 'lucide-react';

export function SystemGauges({ systemState, onSendText }) {
  return (
    <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
      {/* Telemetry Card 1: LLM Engine Status */}
      <div className="hud-glass-panel hud-corners p-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-orbitron font-bold">
            <Cpu className="w-4 h-4" />
            <span>LLM CORE</span>
          </div>
          <p className="text-sm font-semibold text-slate-200 mt-1">Ollama / Qwen2.5</p>
          <span className="text-[10px] font-mono-tech text-emerald-400">STATUS: TOOL-CALLING ACTIVE</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Telemetry Card 2: Voice Pipeline Engine */}
      <div className="hud-glass-panel hud-corners p-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-orbitron font-bold">
            <Radio className="w-4 h-4" />
            <span>VOICE ENGINE</span>
          </div>
          <p className="text-sm font-semibold text-slate-200 mt-1">Faster-Whisper STT</p>
          <span className="text-[10px] font-mono-tech text-cyan-300">TTS: Edge Neural Speech</span>
        </div>
        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
      </div>

      {/* Telemetry Card 3: Vision Scanner */}
      <div className="hud-glass-panel hud-corners p-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-orbitron font-bold">
            <Activity className="w-4 h-4" />
            <span>VISION SENSOR</span>
          </div>
          <p className="text-sm font-semibold text-slate-200 mt-1">YOLOv8 + MediaPipe</p>
          <span className="text-[10px] font-mono-tech text-amber-400">FACE / HAND / OBJECTS</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-amber-400" />
      </div>

      {/* Telemetry Card 4: Hardware Check Trigger */}
      <button 
        onClick={() => onSendText("get system status")}
        className="hud-glass-panel hud-corners p-3 flex items-center justify-between hover:border-cyan-400 transition-all text-left group"
      >
        <div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-orbitron font-bold group-hover:text-cyan-300">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>HARDWARE STATUS</span>
          </div>
          <p className="text-sm font-semibold text-slate-200 mt-1">Check System Metrics</p>
          <span className="text-[10px] font-mono-tech text-cyan-400 group-hover:underline">CLICK TO REFRESH →</span>
        </div>
        <HardDrive className="w-4 h-4 text-cyan-500 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
