// ================================
// NEXA Main Application Module
// ================================
const NEXA = (function() {
    // Private variables
    let ws;
    let statusEl, nexaButton, nexaText;
    let rings = [], glows = [], particles = [];
    let audioContext, analyser, microphone, javascriptNode;
    let isListening = false;
    let isVoiceActive = false;
    let deactivationTimer;
    let animationFrame;
    let voiceLevel = 0;

    // Public methods
    return {
        init,
        setListening,
        sendToServer
    };

    // ================================
    // Initialization
    // ================================
    function init() {
        initDOM();
        initAudio();
        initEventListeners();
        startAnimationLoop();
        connectWebSocket(); // connect after DOM is ready
    }

    // ================================
    // DOM Setup
    // ================================
    function initDOM() {
        statusEl = document.getElementById('status');
        nexaButton = document.getElementById('nexa-button');
        nexaText = document.getElementById('nexa-text');

        rings = Array.from(document.querySelectorAll('.hologram-ring'));
        glows = Array.from(document.querySelectorAll('.ring-glow'));
        particles = Array.from(document.querySelectorAll('.particle'));

        nexaButton.classList.add('idle');
    }

    // ================================
    // WebSocket Connection
    // ================================
    function connectWebSocket() {
        ws = new WebSocket(`ws://${location.host}/ws`);

        ws.onopen = () => {
            console.log("✅ WebSocket connected");
            if (statusEl) statusEl.textContent = "System Ready";
        };

        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                
                // Handle status updates
                if (data.status && statusEl) {
                    statusEl.textContent = data.status;
                }
                
                // Handle scan frames
                if (data.type === "scan_frame" && data.frame) {
                    handleScanFrame(data.frame);
                }
                
                // Handle scan complete
                if (data.type === "scan_complete") {
                    handleScanComplete();
                }
                
                // Handle hologram mode
                if (data.type === "hologram") {
                    handleHologram(data.active);
                }
            } catch (err) {
                console.warn("Invalid WebSocket message:", e.data);
            }
        };

        ws.onclose = () => {
            console.warn("⚠️ WebSocket disconnected. Reconnecting...");
            if (statusEl) statusEl.textContent = "Reconnecting...";
            setTimeout(connectWebSocket, 2000);
        };
    }

    function sendToServer(message) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        } else {
            console.warn("WebSocket not connected. Cannot send:", message);
        }
    }

    // ================================
    // Audio Setup
    // ================================
    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            analyser.smoothingTimeConstant = 0.7;

            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
            javascriptNode.connect(audioContext.destination);
            analyser.connect(javascriptNode);
            javascriptNode.onaudioprocess = processAudio;

        } catch (e) {
            console.error("Error initializing audio:", e);
            statusEl.textContent = "Audio not supported - Click to simulate";
        }
    }

    // ================================
    // Audio Processing
    // ================================
    function processAudio() {
        if (!isListening) return;

        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);

        let values = 0;
        let count = 0;

        const startFreq = Math.floor(85 / (audioContext.sampleRate / analyser.fftSize));
        const endFreq = Math.floor(255 / (audioContext.sampleRate / analyser.fftSize));

        for (let i = startFreq; i <= endFreq && i < array.length; i++) {
            values += array[i];
            count++;
        }

        const average = count > 0 ? values / count : 0;
        voiceLevel = Math.min(average / 255, 1);

        const voiceThreshold = 0.08;
        const silenceThreshold = 0.03;

        if (voiceLevel > voiceThreshold && !isVoiceActive) {
            setVoiceActive(true);
        } else if (voiceLevel < silenceThreshold && isVoiceActive) {
            setVoiceActive(false);
        }

        if (voiceLevel > voiceThreshold) {
            resetDeactivationTimer();
        }
    }

    function setVoiceActive(active) {
        isVoiceActive = active;
        if (active) {
            nexaButton.classList.add('voice-active');
            statusEl.textContent = "VOICE COMMAND RECEIVED";
        } else {
            nexaButton.classList.remove('voice-active');
            if (isListening) {
                statusEl.textContent = "LISTENING...";
            }
        }
    }

    // ================================
    // Visual Updates
    // ================================
    function updateVisualFeedback() {
        if (!isListening) return;

        const intensity = Math.pow(voiceLevel, 0.7);

        rings.forEach((ring, index) => {
            const baseScale = 1 + (intensity * 0.2 * (index + 1));
            ring.style.transform = `${getCurrentTransform(ring)} scale(${baseScale})`;
        });

        glows.forEach((glow, index) => {
            const glowIntensity = 0.1 + (intensity * 0.4 * (2 - index) / 2);
            glow.style.opacity = glowIntensity;
        });

        particles.forEach(p => p.style.transform = `scale(${1 + intensity * 0.5})`);

        const coreGlow = document.querySelector('.core-glow');
        if (coreGlow) {
            coreGlow.style.opacity = 0.3 + (intensity * 0.7);
        }

        if (isVoiceActive) {
            statusEl.textContent = `VOICE LEVEL: ${Math.round(voiceLevel * 100)}%`;
        }
    }

    function getCurrentTransform(element) {
        const style = window.getComputedStyle(element);
        const transform = style.transform;
        if (transform && transform !== 'none') {
            const matrix = transform.split('(')[1].split(')')[0].split(',');
            const rotation = `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[2]}, ${matrix[3]}, 0, 0)`;
            return rotation;
        }
        return '';
    }

    // ================================
    // Event Handlers
    // ================================
    function initEventListeners() {
        nexaButton.addEventListener('click', handleActivation);
        document.addEventListener('click', (e) => {
            if (e.target !== nexaButton && !nexaButton.contains(e.target)) {
                handleActivation();
            }
        });

        document.addEventListener('visibilitychange', handleVisibilityChange);

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                handleActivation();
            }
        });
    }

    function handleActivation() {
        if (isListening) {
            setListening(false);
            statusEl.textContent = "System Standby";
            setTimeout(() => statusEl.textContent = "System Ready", 1500);
        } else {
            setListening(true);
            if (!navigator.mediaDevices) simulateVoiceInput();
            sendToServer("activate");
        }
    }

    // ================================
    // Simulated Voice Mode
    // ================================
    function simulateVoiceInput() {
        let demoIntensity = 0;
        let demoDirection = 1;
        let voiceActive = false;

        const demoInterval = setInterval(() => {
            if (!isListening) {
                clearInterval(demoInterval);
                return;
            }

            demoIntensity += demoDirection * 0.03;
            if (demoIntensity >= 0.7) demoDirection = -1;
            if (demoIntensity <= 0.1) demoDirection = 1;

            voiceLevel = demoIntensity;

            if (!voiceActive && Math.random() > 0.8 && demoIntensity > 0.3) {
                voiceActive = true;
                setVoiceActive(true);
                setTimeout(() => {
                    if (isListening) {
                        setVoiceActive(false);
                        voiceActive = false;
                    }
                }, 1500 + Math.random() * 2000);
            }
        }, 100);

        setTimeout(() => {
            if (isListening) {
                setListening(false);
                statusEl.textContent = "Demo Sequence Complete";
                setTimeout(() => statusEl.textContent = "System Ready", 2000);
            }
        }, 10000);
    }

    // ================================
    // Listening Control
    // ================================
    function setListening(state) {
        isListening = state;

        if (state) {
            nexaButton.classList.remove('idle');
            nexaButton.classList.add('listening');
            statusEl.textContent = "INITIALIZING...";

            setTimeout(() => {
                if (isListening) statusEl.textContent = "LISTENING...";
            }, 1000);

            startAudioProcessing();
            resetDeactivationTimer();
        } else {
            nexaButton.classList.remove('listening', 'voice-active');
            nexaButton.classList.add('idle');
            stopAudioProcessing();
            clearTimeout(deactivationTimer);
            voiceLevel = 0;
            updateVisualFeedback();
        }
    }

    function startAudioProcessing() {
        if (navigator.mediaDevices && audioContext) {
            navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
            }).then(stream => {
                if (audioContext.state === 'suspended') audioContext.resume();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
            }).catch(err => {
                console.error("Mic error:", err);
                statusEl.textContent = "Microphone not available - Demo mode";
                simulateVoiceInput();
            });
        } else {
            statusEl.textContent = "Audio not supported - Demo mode";
            simulateVoiceInput();
        }
    }

    function stopAudioProcessing() {
        if (microphone) {
            microphone.disconnect();
            microphone = null;
        }
        setVoiceActive(false);
    }

    function resetDeactivationTimer() {
        clearTimeout(deactivationTimer);
        deactivationTimer = setTimeout(() => {
            if (isListening) {
                setListening(false);
                statusEl.textContent = "Session Timeout";
                setTimeout(() => statusEl.textContent = "System Ready", 1500);
            }
        }, 8000);
    }

    function handleVisibilityChange() {
        if (document.hidden && audioContext) {
            audioContext.suspend();
        } else if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    function startAnimationLoop() {
        function update() {
            updateVisualFeedback();
            animationFrame = requestAnimationFrame(update);
        }
        update();
    }

    // ================================
    // Scan Frame Handling
    // ================================
    let scanContainer = null;
    let scanImage = null;

    function handleScanFrame(frameBase64) {
        if (!scanContainer) {
            // Create scan overlay if it doesn't exist
            scanContainer = document.createElement('div');
            scanContainer.id = 'scan-overlay';
            scanContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            `;
            
            scanImage = document.createElement('img');
            scanImage.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border: 2px solid #00ffff;
                box-shadow: 0 0 30px #00ffff;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close Scan';
            closeBtn.style.cssText = `
                margin-top: 20px;
                padding: 10px 20px;
                background: #00ffff;
                color: #000;
                border: none;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
            `;
            closeBtn.onclick = handleScanComplete;
            
            scanContainer.appendChild(scanImage);
            scanContainer.appendChild(closeBtn);
            document.body.appendChild(scanContainer);
        }
        
        scanImage.src = `data:image/jpeg;base64,${frameBase64}`;
    }

    function handleScanComplete() {
        if (scanContainer) {
            scanContainer.remove();
            scanContainer = null;
            scanImage = null;
        }
    }

    // ================================
    // Hologram Mode Handling
    // ================================
    let hologramOverlay = null;

    function handleHologram(active) {
        if (active) {
            if (!hologramOverlay) {
                hologramOverlay = document.createElement('div');
                hologramOverlay.id = 'hologram-overlay';
                hologramOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #00ffff;
                    font-size: 3em;
                    text-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
                    font-family: 'Orbitron', monospace;
                    animation: hologramPulse 2s ease-in-out infinite;
                `;
                hologramOverlay.textContent = 'NEXA HOLOGRAM ACTIVATED';
                
                // Add pulse animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes hologramPulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.05); }
                    }
                `;
                document.head.appendChild(style);
                document.body.appendChild(hologramOverlay);
            }
        } else {
            if (hologramOverlay) {
                hologramOverlay.remove();
                hologramOverlay = null;
            }
        }
    }

    function cleanup() {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        if (microphone) microphone.disconnect();
        if (audioContext) audioContext.close();
    }

    window.addEventListener('beforeunload', cleanup);

})();

// ================================
// Initialize on DOM Ready
// ================================
document.addEventListener('DOMContentLoaded', () => {
    NEXA.init();
});
