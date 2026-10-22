import './style.css';
import * as THREE from 'three';

const models = [
  {
    id: 'Axiom-01',
    vm: 'VM-A1',
    type: 'Language',
    status: 'Training',
    progress: 84,
    accuracy: 96.8,
    load: 76,
    power: '1.4kW',
    tasks: 'Reasoning'
  },
  {
    id: 'Nova-02',
    vm: 'VM-B2',
    type: 'Vision',
    status: 'Optimizing',
    progress: 69,
    accuracy: 94.2,
    load: 64,
    power: '1.1kW',
    tasks: 'Object detection'
  },
  {
    id: 'Sigma-03',
    vm: 'VM-C3',
    type: 'Forecast',
    status: 'Training',
    progress: 91,
    accuracy: 97.5,
    load: 81,
    power: '1.6kW',
    tasks: 'Prediction'
  },
  {
    id: 'Apex-04',
    vm: 'VM-D4',
    type: 'Agentic',
    status: 'Queued',
    progress: 48,
    accuracy: 92.1,
    load: 52,
    power: '1.2kW',
    tasks: 'Automation'
  }
];

const modelList = document.getElementById('modelList');
const trainAllButton = document.getElementById('train-all');
const scaleUpButton = document.getElementById('scale-up');
const loopState = document.getElementById('loopState');

const updateMetricSummary = () => {
  const avgAccuracy = models.reduce((sum, model) => sum + model.accuracy, 0) / models.length;
  const avgLoad = models.reduce((sum, model) => sum + model.load, 0) / models.length;

  document.getElementById('throughput').textContent = `${Math.min(99, Math.round(84 + avgAccuracy / 4))}%`;
  document.getElementById('accuracy').textContent = `${avgAccuracy.toFixed(1)}%`;
  document.getElementById('energy').textContent = `${Math.round(32 + avgLoad * 0.18)} kWh`;
  document.getElementById('loadValue').textContent = `${Math.round(avgLoad)}%`;
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
            <span>${model.power}</span>
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

const advanceTraining = () => {
  models.forEach((model) => {
    if (model.status === 'Queued') {
      model.status = 'Training';
    }

    if (model.status === 'Training') {
      model.progress = Math.min(100, model.progress + Math.random() * 6 + 2);
      model.accuracy = Math.min(99.9, model.accuracy + Math.random() * 0.7);
      model.load = Math.min(96, model.load + Math.random() * 4);

      if (model.progress >= 100) {
        model.status = 'Complete';
        model.accuracy = Math.max(model.accuracy, 99.1);
      }
    }

    if (model.status === 'Complete') {
      model.load = Math.max(65, model.load - 0.8);
    }

    if (model.status === 'Optimizing') {
      model.progress = Math.min(100, model.progress + Math.random() * 4);
      model.accuracy = Math.min(99.5, model.accuracy + Math.random() * 0.4);
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
  renderModels();
});

scaleUpButton.addEventListener('click', () => {
  models.forEach((model) => {
    model.load = Math.min(99, model.load + 8);
    model.status = model.status === 'Complete' ? 'Optimizing' : model.status;
  });

  loopState.textContent = 'Scaling';
  renderModels();
});

setInterval(() => {
  advanceTraining();
  const activeTraining = models.filter((m) => m.status === 'Training' || m.status === 'Optimizing').length;
  loopState.textContent = activeTraining > 0 ? 'Optimizing' : 'Idle';
}, 1800);

renderModels();

const buildCity = () => {
  const cityRoot = document.getElementById('cityCanvas');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07131d);
  scene.fog = new THREE.Fog(0x07131d, 16, 34);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
  camera.position.set(0, 7, 20);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(cityRoot.clientWidth, cityRoot.clientHeight);
  cityRoot.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0x8fbaff, 1.5);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0x8ae8ff, 1.7);
  keyLight.position.set(10, 20, 8);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x7dd7ff, 26, 35, 2);
  rimLight.position.set(-10, 6, 15);
  scene.add(rimLight);

  const building = new THREE.Group();
  scene.add(building);

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x9ec6ff,
    emissive: 0x102337,
    roughness: 0.5,
    metalness: 0.7
  });

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: 0x7fc8ff,
    emissive: 0x1a3f5a,
    transparent: true,
    opacity: 0.8,
    roughness: 0.2,
    metalness: 0.9
  });

  for (let i = 0; i < 8; i += 1) {
    const floor = new THREE.Mesh(new THREE.BoxGeometry(9, 1.2, 7), floorMaterial);
    floor.position.y = i * 1.6;
    building.add(floor);

    const windowPanel = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.4, 5.8), glassMaterial);
    windowPanel.position.set(0, floor.position.y + 0.2, 0);
    building.add(windowPanel);
  }

  const core = new THREE.Mesh(new THREE.BoxGeometry(2.2, 11.5, 2.2), new THREE.MeshStandardMaterial({ color: 0x7ad9ff, emissive: 0x16394f, metalness: 0.8, roughness: 0.2 }));
  core.position.y = 5.7;
  building.add(core);

  const podium = new THREE.Mesh(new THREE.BoxGeometry(12, 1.2, 9), new THREE.MeshStandardMaterial({ color: 0x93a7d8, metalness: 0.65, roughness: 0.38 }));
  podium.position.y = -0.7;
  building.add(podium);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(7.9, 0.14, 16, 80),
    new THREE.MeshStandardMaterial({ color: 0x51d7ef, emissive: 0x103847, metalness: 0.8, roughness: 0.15 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.3;
  building.add(ring);

  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(16, 18, 1.3, 40),
    new THREE.MeshStandardMaterial({ color: 0x0f2031, roughness: 0.9, metalness: 0.2 })
  );
  ground.position.y = -1.5;
  scene.add(ground);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 200;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 40;
    starPositions[i + 1] = Math.random() * 20;
    starPositions[i + 2] = (Math.random() - 0.5) * 40;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xb5ebff, size: 0.08 }));
  scene.add(stars);

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

    building.rotation.y = t * 0.35;
    ring.rotation.z = t * 0.75;
    core.rotation.y = t * 0.9;
    camera.position.x = Math.sin(t * 0.5) * 2.3;
    camera.position.y = 8 + Math.sin(t * 1.1) * 0.7;
    camera.lookAt(0, 5, 0);

    stars.rotation.y = t * 0.08;
    rimLight.intensity = 18 + Math.sin(t * 2) * 8;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
};

buildCity();
