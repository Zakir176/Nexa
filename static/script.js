let scene, camera, renderer, rings = [];
let ws, statusEl, nexaButton, nexaText, buttonRing;

init();
connectWebSocket();

function init() {
  const container = document.getElementById('scene-container');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Glowing rings (background animation)
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
    rings.push({ mesh: ring, delay: i * 0.8 });
  }

  statusEl = document.getElementById('status');
  nexaButton = document.getElementById('nexa-button');
  nexaText = document.getElementById('nexa-text');
  buttonRing = document.getElementById('button-ring');

  // Start idle animation
  nexaButton.classList.add('idle');

  // Tap-to-activate handler
  nexaButton.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send('activate');
      setListening(true);
    } else {
      console.warn('WebSocket not open');
    }
  });

  animate();
  window.addEventListener('resize', onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  rings.forEach((r) => {
    const t = (Date.now() * 0.001 + r.delay) % 3;
    const scale = 0.8 + (t < 1.5 ? t : 3 - t);
    r.mesh.scale.setScalar(scale);
    r.mesh.material.opacity = t < 1.5 ? 0.3 - t * 0.1 : 0.1;
  });

  renderer.render(scene, camera);
}

function connectWebSocket() {
  ws = new WebSocket(`ws://${location.host}/ws`);

  ws.onopen = () => console.log('✅ WebSocket connected');
  ws.onerror = (e) => console.error('❌ WebSocket error:', e);

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);

    if (data.status === 'listening') {
      statusEl.textContent = 'LISTENING...';
      setListening(true);
    } else if (data.status === 'done') {
      statusEl.textContent = data.text;
      setListening(false);
      setTimeout(() => (statusEl.textContent = 'Tap to activate'), 2000);
    } else if (data.status === 'no_voice') {
      statusEl.textContent = 'NO VOICE';
      setListening(false);
      setTimeout(() => (statusEl.textContent = 'Tap to activate'), 1500);
    }
  };
}

function setListening(state) {
  if (state) {
    nexaButton.classList.remove('idle');
    nexaButton.classList.add('listening');
  } else {
    nexaButton.classList.remove('listening');
    nexaButton.classList.add('idle');
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
