import { useState, useEffect, useRef, useCallback } from 'react';

export function useNexaWebSocket() {
  const [connected, setConnected] = useState(false);
  const [systemState, setSystemState] = useState('IDLE');
  const [statusMessage, setStatusMessage] = useState('System Ready');
  const [logs, setLogs] = useState([]);
  const [scanFrame, setScanFrame] = useState(null);
  const [scanMetadata, setScanMetadata] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const wsRef = useRef(null);
  const audioRef = useRef(null);

  const addLog = useCallback((sender, text, type = 'info') => {
    setLogs((prev) => [
      { id: Date.now() + Math.random(), sender, text, type, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 49)
    ]);
  }, []);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host.includes('5173') ? 'localhost:8000' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    console.log('[Nexa WS] Connecting to:', wsUrl);
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setStatusMessage('System Online');
      addLog('SYSTEM', 'WebSocket connection established.');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'state_change') {
          setSystemState(data.state);
          setStatusMessage(data.message);
        } else if (data.type === 'transcription') {
          addLog('USER', `"${data.text}"`);
        } else if (data.type === 'tool_result') {
          addLog('TOOL', `${data.tool} → ${data.result}`, 'tool');
        } else if (data.type === 'response') {
          addLog('NEXA', data.text, 'nexa');
          if (data.audio_b64) {
            playAudioResponse(data.audio_b64);
          }
        } else if (data.type === 'scan_frame') {
          setScanFrame(`data:image/jpeg;base64,${data.frame}`);
          setScanMetadata(data.metadata);
          setIsScanning(true);
        } else if (data.type === 'scan_complete') {
          setIsScanning(false);
          setScanFrame(null);
          setScanMetadata(null);
          addLog('VISION', 'Environment scan finished.');
        }
      } catch (err) {
        console.warn('[Nexa WS] JSON Parse error:', err);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setStatusMessage('Disconnected. Retrying...');
      addLog('SYSTEM', 'WebSocket connection closed. Reconnecting in 3s...', 'warn');
      setTimeout(connect, 3000);
    };

    ws.onerror = (err) => {
      console.error('[Nexa WS] Error:', err);
    };
  }, [addLog]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const playAudioResponse = (b64Audio) => {
    try {
      const audioUrl = `data:audio/mp3;base64,${b64Audio}`;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play().catch((e) => console.warn('Audio play error:', e));
    } catch (e) {
      console.error('Failed to play TTS audio:', e);
    }
  };

  const activateVoice = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'activate' }));
    }
  };

  const sendTextCommand = (text) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && text.trim()) {
      wsRef.current.send(JSON.stringify({ action: 'text_command', text }));
    }
  };

  const triggerScan = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'start_scan' }));
    }
  };

  const stopScan = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'stop_scan' }));
    }
  };

  return {
    connected,
    systemState,
    statusMessage,
    logs,
    scanFrame,
    scanMetadata,
    isScanning,
    activateVoice,
    sendTextCommand,
    triggerScan,
    stopScan
  };
}
