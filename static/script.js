let scene, camera, renderer, rings = [];
let ws, statusEl, nexaText;

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

  // Create 3 glowing rings
  for (let i = 0; i < 3; i++) {
    const geometry = new THREE.RingGeometry(1.5, 1.6, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.PI / 2 * 0.3;
    ring.scale.setScalar(1 + i * 0.5);
    scene.add(ring);
    rings.push({ mesh: ring, delay: i * 0.8 });
  }

  statusEl = document.getElementById('status');
  nexaText = document.getElementById('nexa-text');

  nexaText.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send('activate');
  });

  animate();
  window.addEventListener('resize', onWindowResize);
}

function animate() {
  requestAnimationFrame(animate);

  rings.forEach((r, i) => {
    const t = (Date.now() * 0.001 + r.delay) % 3;
    const scale = 0.8 + (t < 1.5 ? t : 3 - t) * 1.0;
    r.mesh.scale.setScalar(scale);
    r.mesh.material.opacity = t < 1.5 ? 0.8 - t * 0.5 : 0;
  });

  renderer.render(scene, camera);
}

function connectWebSocket() {
  ws = new WebSocket(`ws://${location.host}/ws`);
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.status === 'listening') {
      statusEl.textContent = 'LISTENING...';
      rippleEffect();
    } else if (data.status === 'done') {
      statusEl.textContent = data.text;
      setTimeout(() => statusEl.textContent = 'Tap to activate', 2000);
    } else if (data.status === 'no_voice') {
      statusEl.textContent = 'NO VOICE';
      setTimeout(() => statusEl.textContent = 'Tap to activate', 1500);
    }
  };
}

function rippleEffect() {
  const ripple = document.createElement('div');
  ripple.className = 'absolute w-96 h-96 border-4 border-cyan-400 rounded-full animate-ping';
  ripple.style.left = '50%'; ripple.style.top = '50%';
  ripple.style.transform = 'translate(-50%, -50%)';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1500);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}