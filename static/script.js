// Main application module
const JARVIS = (function() {
    // Private variables
    let scene, camera, renderer, rings = [];
    let ws, statusEl, jarvisButton, jarvisText, buttonRing;
    let audioContext, analyser, microphone, javascriptNode;
    let isListening = false;
    let deactivationTimer;

    // Public methods
    return {
        init,
        connectWebSocket,
        setListening
    };

    // Initialization function
    function init() {
        initThreeJS();
        initDOM();
        initAudio();
        initEventListeners();
        animate();
    }

    // Three.js initialization
    function initThreeJS() {
        const container = document.getElementById('scene-container');
        
        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer setup
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Create glowing background rings
        createRings();
    }

    // Create animated background rings
    function createRings() {
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.RingGeometry(1.5, 1.6, 64);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.1
            });
            
            const ring = new THREE.Mesh(geometry, material);
            ring.rotation.x = Math.PI * 0.3;
            ring.scale.setScalar(1 + i * 0.6);
            scene.add(ring);
            
            rings.push({ 
                mesh: ring, 
                delay: i * 0.8 
            });
        }
    }

    // DOM elements initialization
    function initDOM() {
        statusEl = document.getElementById('status');
        jarvisButton = document.getElementById('jarvis-button');
        jarvisText = document.getElementById('jarvis-text');
        buttonRing = document.getElementById('button-ring');

        // Start in idle state
        jarvisButton.classList.add('idle');
    }

    // Audio context initialization
    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            
            javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
            
            // Connect the nodes
            javascriptNode.connect(audioContext.destination);
            analyser.connect(javascriptNode);
            
            javascriptNode.onaudioprocess = processAudio;
            
        } catch (e) {
            console.error("Error initializing audio:", e);
        }
    }

    // Audio processing for voice detection
    function processAudio() {
        if (!isListening) return;
        
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        
        let values = 0;
        const length = array.length;
        
        // Get the average of the values
        for (let i = 0; i < length; i++) {
            values += array[i];
        }
        
        const average = values / length;
        
        // Update visual feedback based on audio input
        updateVoiceFeedback(average);
        
        // Reset deactivation timer when voice is detected
        if (average > 10) {
            resetDeactivationTimer();
        }
    }

    // Visual feedback for voice input
    function updateVoiceFeedback(intensity) {
        const normalizedIntensity = intensity / 255;
        
        // Update button ring based on voice intensity
        const scale = 1 + (normalizedIntensity * 0.2);
        const glow = 30 + (normalizedIntensity * 70);
        
        buttonRing.style.transform = `scale(${scale})`;
        buttonRing.style.boxShadow = `0 0 ${glow}px rgba(0, 195, 255, ${0.7 + normalizedIntensity * 0.3})`;
    }

    // Event listeners setup
    function initEventListeners() {
        // Tap to activate
        jarvisButton.addEventListener('click', handleActivation);
        
        // Window resize
        window.addEventListener('resize', onWindowResize);
        
        // Handle visibility change for audio context
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    // Activation handler
    function handleActivation() {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send('activate');
            setListening(true);
        } else {
            console.warn('WebSocket not open');
            // Fallback: simulate activation
            setListening(true);
            simulateVoiceInput();
        }
    }

    // Simulate voice input for demo purposes
    function simulateVoiceInput() {
        let intensity = 0;
        let direction = 1;
        
        const interval = setInterval(() => {
            if (!isListening) {
                clearInterval(interval);
                return;
            }
            
            intensity += direction * 0.1;
            if (intensity >= 1) direction = -1;
            if (intensity <= 0.1) direction = 1;
            
            updateVoiceFeedback(intensity * 255);
        }, 100);
        
        // Auto deactivate after 5 seconds in demo mode
        setTimeout(() => {
            if (isListening) {
                setListening(false);
                statusEl.textContent = "Ready for commands";
                setTimeout(() => {
                    statusEl.textContent = "Tap to activate";
                }, 2000);
            }
        }, 5000);
    }

    // WebSocket connection
    function connectWebSocket() {
        // Replace with your WebSocket server URL
        const wsUrl = `ws://${location.host}/ws`;
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('✅ WebSocket connected');
            statusEl.textContent = "Ready - Tap to activate";
        };

        ws.onerror = (e) => {
            console.error('❌ WebSocket error:', e);
            statusEl.textContent = "Offline - Tap to simulate";
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            handleWebSocketMessage(data);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
        };
    }

    // Handle WebSocket messages
    function handleWebSocketMessage(data) {
        if (data.status === 'listening') {
            statusEl.textContent = 'LISTENING...';
            setListening(true);
        } else if (data.status === 'done') {
            statusEl.textContent = data.text || 'Command processed';
            setListening(false);
            setTimeout(() => (statusEl.textContent = 'Tap to activate'), 2000);
        } else if (data.status === 'no_voice') {
            statusEl.textContent = 'NO VOICE DETECTED';
            setListening(false);
            setTimeout(() => (statusEl.textContent = 'Tap to activate'), 1500);
        } else if (data.status === 'error') {
            statusEl.textContent = 'ERROR: ' + (data.message || 'Unknown error');
            setListening(false);
            setTimeout(() => (statusEl.textContent = 'Tap to activate'), 2000);
        }
    }

    // Set listening state
    function setListening(state) {
        isListening = state;
        
        if (state) {
            // Start listening
            jarvisButton.classList.remove('idle');
            jarvisButton.classList.add('listening');
            statusEl.textContent = 'LISTENING...';
            
            // Start audio processing
            startAudioProcessing();
            
            // Set deactivation timer
            resetDeactivationTimer();
            
        } else {
            // Stop listening
            jarvisButton.classList.remove('listening');
            jarvisButton.classList.add('idle');
            
            // Stop audio processing
            stopAudioProcessing();
            
            // Clear deactivation timer
            clearTimeout(deactivationTimer);
            
            // Reset visual elements
            buttonRing.style.transform = '';
            buttonRing.style.boxShadow = '';
        }
    }

    // Start audio processing
    function startAudioProcessing() {
        if (navigator.mediaDevices && audioContext) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
                .then(function(stream) {
                    microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);
                })
                .catch(function(err) {
                    console.error("Error accessing microphone:", err);
                });
        }
    }

    // Stop audio processing
    function stopAudioProcessing() {
        if (microphone) {
            microphone.disconnect();
            microphone = null;
        }
    }

    // Reset deactivation timer
    function resetDeactivationTimer() {
        clearTimeout(deactivationTimer);
        deactivationTimer = setTimeout(() => {
            if (isListening) {
                setListening(false);
                statusEl.textContent = "Session timeout";
                setTimeout(() => {
                    statusEl.textContent = "Tap to activate";
                }, 1500);
            }
        }, 3000);
    }

    // Handle visibility change
    function handleVisibilityChange() {
        if (document.hidden && audioContext) {
            audioContext.suspend();
        } else if (audioContext) {
            audioContext.resume();
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Animate background rings
        rings.forEach((r) => {
            const t = (Date.now() * 0.001 + r.delay) % 3;
            const scale = 0.8 + (t < 1.5 ? t : 3 - t);
            r.mesh.scale.setScalar(scale);
            r.mesh.material.opacity = t < 1.5 ? 0.3 - t * 0.1 : 0.1;
        });

        renderer.render(scene, camera);
    }

    // Window resize handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
})();

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    JARVIS.init();
    JARVIS.connectWebSocket();
});