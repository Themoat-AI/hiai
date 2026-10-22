import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const models = [
  {
    id: 'Axiom-01',
    vm: 'VM-A1',
    type: 'Cognitive Language',
    status: 'Training',
    progress: 88,
    accuracy: 97.4,
    load: 78,
    power: '1.8kW',
    tasks: 'Reasoning',
    risk: 'Adaptive'
  },
  {
    id: 'Nova-02',
    vm: 'VM-B2',
    type: 'Vision Intelligence',
    status: 'Optimizing',
    progress: 73,
    accuracy: 95.2,
    load: 66,
    power: '1.5kW',
    tasks: 'Perception',
    risk: 'Low'
  },
  {
    id: 'Sigma-03',
    vm: 'VM-C3',
    type: 'Predictive Forecast',
    status: 'Training',
    progress: 95,
    accuracy: 98.1,
    load: 84,
    power: '2.1kW',
    tasks: 'Forecasting',
    risk: 'High scale'
  },
  {
    id: 'Apex-04',
    vm: 'VM-D4',
    type: 'Autonomous Agent',
    status: 'Queued',
    progress: 52,
    accuracy: 93.8,
    load: 55,
    power: '1.6kW',
    tasks: 'Automation',
    risk: 'Balanced'
  }
];

const state = {
  mode: 'Autonomy',
  logIndex: 0,
  eventLog: [
    'Quantum mesh synchronization complete.',
    'Inference routing optimized across four cores.',
    'Adaptive prompt fine-tuning active.',
    'Safety envelope refreshed for live model stack.'
  ]
};

const modelList = document.getElementById('modelList');
const trainAllButton = document.getElementById('train-all');
const scaleUpButton = document.getElementById('scale-up');
const loopState = document.getElementById('loopState');
const eventFeed = document.getElementById('eventFeed');
const missionLabel = document.getElementById('missionLabel');
const protocolLabel = document.getElementById('protocolLabel');

const missionMap = {
  Autonomy: ['Adaptive cognition', 'SYNTHETIC-9'],
  Research: ['Deep experimentation', 'R&D MATRIX-4'],
  Security: ['Threat simulation', 'SHIELD-LAYER-11'],
  Simulation: ['Scenario emulation', 'DIGITAL-ORBIT-3']
};

const renderEventFeed = () => {
  eventFeed.innerHTML = state.eventLog
    .slice(0, 5)
    .map(
      (event) => `
        <li>
          <span class="dot"></span>
          <span>${event}</span>
        </li>
      `
    )
    .join('');
};

const updateMetricSummary = () => {
  const avgAccuracy = models.reduce((sum, model) => sum + model.accuracy, 0) / models.length;
  const avgLoad = models.reduce((sum, model) => sum + model.load, 0) / models.length;

  document.getElementById('throughput').textContent = `${Math.min(99, Math.round(86 + avgAccuracy / 7))}%`;
  document.getElementById('accuracy').textContent = `${avgAccuracy.toFixed(1)}%`;
  document.getElementById('energy').textContent = `${Math.round(26 + avgLoad * 0.28)} kWh`;
  document.getElementById('loadValue').textContent = `${Math.round(avgLoad)}%`;
  document.getElementById('vmNodes').textContent = `${18 + Math.round(avgLoad / 8)}`;
};

const renderModels = () => {
  modelList.innerHTML = models
    .map(
      (model) => `
        <article class="model-card ${model.status.toLowerCase().replace(/\s+/g, '-')}">
          <div class="model-row">
            <div>
              <p class="model-name">${model.id}</p>
              <span class="model-type">${model.type}</span>
            </div>
            <span class="status-pill">${model.status}</span>
          </div>

          <div class="model-meta">
            <span>${model.vm}</span>
            <span>${model.risk}</span>
          </div>

          <div class="progress-block">
            <div class="progress-label">
              <span>Progress</span>
              <strong>${Math.round(model.progress)}%</strong>
            </div>
            <div class="progress-bar">
              <span style="width: ${model.progress}%"></span>
            </div>
          </div>

          <div class="model-stats">
            <span>Accuracy ${model.accuracy.toFixed(1)}%</span>
            <span>Load ${model.load}%</span>
          </div>
        </article>
      `
    )
    .join('');

  updateMetricSummary();
};

const pushLog = (message) => {
  state.eventLog.unshift(message);
  state.eventLog = state.eventLog.slice(0, 5);
  renderEventFeed();
};

const advanceTraining = () => {
  models.forEach((model) => {
    if (model.status === 'Queued') {
      model.status = 'Training';
      pushLog(`${model.id} has entered the active training mesh.`);
    }

    if (model.status === 'Training') {
      model.progress = Math.min(100, model.progress + Math.random() * 6 + 1.5);
      model.accuracy = Math.min(99.9, model.accuracy + Math.random() * 0.8);
      model.load = Math.min(96, model.load + Math.random() * 4.5);

      if (model.progress >= 100) {
        model.status = 'Complete';
        model.accuracy = Math.max(model.accuracy, 99.2);
        pushLog(`${model.id} reached stable convergence.`);
      }
    }

    if (model.status === 'Complete') {
      model.load = Math.max(62, model.load - 0.8);
    }

    if (model.status === 'Optimizing') {
      model.progress = Math.min(100, model.progress + Math.random() * 4.2);
      model.accuracy = Math.min(99.8, model.accuracy + Math.random() * 0.5);
      model.load = Math.min(94, model.load + Math.random() * 3.2);
    }
  });

  renderModels();
};

trainAllButton.addEventListener('click', () => {
  models.forEach((model) => {
    if (model.status !== 'Complete') {
      model.status = 'Training';
    }
  });

  loopState.textContent = 'Training';
  pushLog('All model nodes engaged in synchronized training wave.');
  renderModels();
});

scaleUpButton.addEventListener('click', () => {
  models.forEach((model) => {
    model.load = Math.min(99, model.load + 8);
    model.status = model.status === 'Complete' ? 'Optimizing' : model.status;
  });

  loopState.textContent = 'Scaling';
  pushLog('Compute fabric expanded with additional virtualization layers.');
  renderModels();
});

document.querySelectorAll('.mode-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    state.mode = button.dataset.mode;
    const [mission, protocol] = missionMap[state.mode];
    missionLabel.textContent = mission;
    protocolLabel.textContent = protocol;

    pushLog(`Protocol switched to ${state.mode.toUpperCase()} mode.`);
  });
});

setInterval(() => {
  advanceTraining();
  const activeTraining = models.filter((m) => m.status === 'Training' || m.status === 'Optimizing').length;
  loopState.textContent = activeTraining > 0 ? 'Optimizing' : 'Idle';
}, 1800);

renderModels();
renderEventFeed();

const buildCity = () => {
  const cityRoot = document.getElementById('cityCanvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050d14);
  scene.fog = new THREE.Fog(0x050d14, 18, 40);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(0, 8, 24);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(cityRoot.clientWidth, cityRoot.clientHeight);
  cityRoot.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 14;
  controls.maxDistance = 32;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;

  const ambient = new THREE.AmbientLight(0x9ac7ff, 1.6);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0x7fe6ff, 2.4);
  keyLight.position.set(8, 18, 10);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x8cb9ff, 30, 60, 2.2);
  rimLight.position.set(-10, 10, 15);
  scene.add(rimLight);

  const campus = new THREE.Group();
  scene.add(campus);

  const podiumMaterial = new THREE.MeshStandardMaterial({
    color: 0x8fa5d3,
    emissive: 0x0c1d2d,
    metalness: 0.8,
    roughness: 0.35
  });

  const towerMaterial = new THREE.MeshStandardMaterial({
    color: 0x8fe4ff,
    emissive: 0x102b49,
    metalness: 0.7,
    roughness: 0.25
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x7cc7ff,
    emissive: 0x142b46,
    transparent: true,
    opacity: 0.72,
    metalness: 0.9,
    roughness: 0.18
  });

  const podium = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 10), podiumMaterial);
  podium.position.y = -0.8;
  campus.add(podium);

  const towerOffsets = [-5.2, -2.1, 1.5, 4.8];
  towerOffsets.forEach((x, index) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(2.4, 8 + index * 1.5, 2.4), towerMaterial);
    tower.position.set(x, 3.2 + index * 0.9, index % 2 === 0 ? -2.1 : 2.1);
    campus.add(tower);

    const face = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4.8 + index, 1.8), glassMaterial);
    face.position.set(x, tower.position.y + 0.3, tower.position.z);
    campus.add(face);
  });

  const centerCore = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 12.5, 2.8),
    new THREE.MeshStandardMaterial({ color: 0x79e6ff, emissive: 0x1b4667, metalness: 0.85, roughness: 0.2 })
  );
  centerCore.position.y = 5.8;
  campus.add(centerCore);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.14, 18, 120),
    new THREE.MeshStandardMaterial({ color: 0x6fd8ff, emissive: 0x1a4161, metalness: 0.8, roughness: 0.15 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.7;
  campus.add(ring);

  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(17, 19, 1.5, 48),
    new THREE.MeshStandardMaterial({ color: 0x0d1f2c, roughness: 0.92, metalness: 0.18 })
  );
  ground.position.y = -1.9;
  scene.add(ground);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 220;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 40;
    positions[i + 1] = Math.random() * 24 + 2;
    positions[i + 2] = (Math.random() - 0.5) * 40;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xc0ebff, size: 0.09, transparent: true, opacity: 0.9 })
  );
  scene.add(stars);

  const orbitalNodes = [];
  for (let i = 0; i < 8; i += 1) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 18, 18),
      new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x7fe6ff : 0xa8b8ff, emissive: 0x1f3d59 })
    );
    const angle = (i / 8) * Math.PI * 2;
    mesh.position.set(Math.cos(angle) * 10, 6 + Math.sin(angle * 2.4) * 3, Math.sin(angle) * 10);
    campus.add(mesh);
    orbitalNodes.push({ mesh, angle, radius: 10 });
  }

  const resize = () => {
    const { clientWidth, clientHeight } = cityRoot;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
  };

  window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();

  const animate = () => {
    const t = clock.getElapsedTime();

    campus.rotation.y = t * 0.22;
    ring.rotation.z = t * 0.8;
    centerCore.rotation.y = t * 0.9;
    rimLight.intensity = 26 + Math.sin(t * 2.3) * 8;
    stars.rotation.y = t * 0.08;

    orbitalNodes.forEach((node, index) => {
      const offset = t * (0.5 + index * 0.08);
      node.mesh.position.x = Math.cos(node.angle + offset) * node.radius;
      node.mesh.position.z = Math.sin(node.angle + offset) * node.radius;
      node.mesh.position.y = 6 + Math.sin(offset * 2.2 + index) * 3;
      node.mesh.scale.setScalar(1 + Math.sin(offset * 4) * 0.25);
    });

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
};

buildCity();
