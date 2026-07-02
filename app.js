
(function(){
"use strict";

var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   ROAD PATH — shared sine wiggle used by both the DOM glow-trail
   (drawn in document flow) and the 3D car overlay (fixed to
   viewport), so the car always rides the line painted on the page.
   ============================================================ */
var Road = {
  amplitude: 120,
  wavelength: 1500,
  centerX: window.innerWidth / 2,
  docHeight: document.documentElement.scrollHeight,
  viewportW: window.innerWidth,

  xAt: function(docY){
    return this.centerX + Math.sin(docY / this.wavelength) * this.amplitude;
  },
  slopeAt: function(docY){
    return (this.amplitude / this.wavelength) * Math.cos(docY / this.wavelength);
  },
  recalc: function(){
    this.viewportW = window.innerWidth;
    this.centerX = window.innerWidth / 2;
    this.amplitude = Math.min(130, window.innerWidth * 0.2);
    this.docHeight = document.documentElement.scrollHeight;
  }
};
Road.recalc();

/* ---------- scene layers that must span full document height ---------- */
var sceneGradientEl = document.getElementById('scene-gradient');
var roadLayerEl = document.getElementById('road-layer');
var svgEl = roadLayerEl.querySelector('svg');
var basePathEl = document.getElementById('road-base-path');
var skidPathEl = document.getElementById('road-skid-path');

function buildRoadPathString(){
  var h = Road.docHeight;
  var step = 24;
  var pts = [];
  for (var y = 0; y <= h; y += step){
    pts.push([Road.xAt(y), y]);
  }
  if (pts.length === 0 || pts[pts.length - 1][1] < h){
    pts.push([Road.xAt(h), h]);
  }
  var d = 'M ' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
  for (var i = 1; i < pts.length; i++){
    d += ' L ' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1);
  }
  return d;
}

var skidPathLength = 0;

function layoutScene(){
  Road.recalc();

  sceneGradientEl.style.height = Road.docHeight + 'px';

  svgEl.setAttribute('width', Road.viewportW);
  svgEl.setAttribute('height', Road.docHeight);
  svgEl.setAttribute('viewBox', '0 0 ' + Road.viewportW + ' ' + Road.docHeight);
  roadLayerEl.style.height = Road.docHeight + 'px';

  var d = buildRoadPathString();
  basePathEl.setAttribute('d', d);
  skidPathEl.setAttribute('d', d);

  skidPathLength = skidPathEl.getTotalLength();
  skidPathEl.style.strokeDasharray = skidPathLength;
  skidPathEl.style.strokeDashoffset = skidPathLength;
}

function updateSkidReveal(){
  var scrollFrac = window.scrollY / Math.max(1, (Road.docHeight - window.innerHeight));
  scrollFrac = Math.max(0, Math.min(1, scrollFrac));
  var offset = skidPathLength * (1 - scrollFrac);
  skidPathEl.style.strokeDashoffset = offset;
}

/* ============================================================
   SCROLL REVEALS
   ============================================================ */
var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
if (reduceMotion){
  revealEls.forEach(function(el){ el.classList.add('is-visible'); });
} else if ('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(function(el){ io.observe(el); });
} else {
  revealEls.forEach(function(el){ el.classList.add('is-visible'); });
}

/* ---------- stat counters ---------- */
var statNums = document.querySelectorAll('.stat .num');
var statsAnimated = false;
function animateStats(){
  if (statsAnimated) return;
  statsAnimated = true;
  statNums.forEach(function(el){
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = reduceMotion ? 1 : 1400;
    var start = null;
    function step(ts){
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}
var statsSection = document.querySelector('.stats');
if (statsSection && 'IntersectionObserver' in window){
  var statsIO = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){ animateStats(); statsIO.disconnect(); }
    });
  }, { threshold: 0.4 });
  statsIO.observe(statsSection);
} else {
  animateStats();
}

/* ============================================================
   NAV — switches to "on-dark" styling once the dark zone
   (stats section onward) scrolls under it
   ============================================================ */
var navEl = document.getElementById('nav');
var firstDarkZone = document.querySelector('.zone-dark');
var darkZoneStart = Infinity;

function measureDarkZone(){
  if (firstDarkZone){
    var rect = firstDarkZone.getBoundingClientRect();
    darkZoneStart = rect.top + window.scrollY;
  }
}

function updateNav(){
  if (window.scrollY + 70 > darkZoneStart){
    navEl.classList.add('on-dark');
  } else {
    navEl.classList.remove('on-dark');
  }
}

/* ============================================================
   THREE.JS — DRIFTING BRAIN-CAR
   ============================================================ */
var canvas = document.getElementById('car-canvas');
var renderer, scene, camera, carGroup, wheels = [], brainMesh, engineLight;
var smokePool = [];
var MAX_SMOKE = 70;
var smokeTexture;
var clock = new THREE.Clock();

var carState = {
  x: Road.centerX,
  targetX: Road.centerX,
  yaw: 0,
  bank: 0,
  lastScrollY: window.scrollY,
  smoothSpeed: 0,
  screenYpx: window.innerHeight * 0.4,
  worldYTarget: 0
};

function initThree(){
  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  scene = new THREE.Scene();

  var w = window.innerWidth, h = window.innerHeight;
  camera = new THREE.OrthographicCamera(-w/2, w/2, h/2, -h/2, 1, 2000);
  camera.position.set(0, 130, 640);
  camera.lookAt(0, -14, 0);

  var ambient = new THREE.AmbientLight(0x6a5a8a, 0.65);
  scene.add(ambient);

  var key = new THREE.DirectionalLight(0xffcfa0, 1.25);
  key.position.set(260, 300, 340);
  scene.add(key);

  var rim = new THREE.DirectionalLight(0xff8a5c, 0.9);
  rim.position.set(-260, 160, -280);
  scene.add(rim);

  var fill = new THREE.DirectionalLight(0x8fa6ff, 0.35);
  fill.position.set(-100, -60, 200);
  scene.add(fill);

  engineLight = new THREE.PointLight(0xff6a45, 0.6, 260);
  engineLight.position.set(0, -10, 0);
  scene.add(engineLight);

  buildSmokeTexture();
  buildCar();

  window.addEventListener('resize', onThreeResize);
}

function onThreeResize(){
  var w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  camera.left = -w/2; camera.right = w/2; camera.top = h/2; camera.bottom = -h/2;
  camera.updateProjectionMatrix();
}

/* ---------- procedural textures ---------- */
function buildBrainTexture(){
  var c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  var ctx = c.getContext('2d');

  var base = ctx.createLinearGradient(0, 0, 512, 512);
  base.addColorStop(0, '#e9b9ad');
  base.addColorStop(0.5, '#e2a89b');
  base.addColorStop(1, '#d99a8d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);

  // soft mottled shading blotches (sulci shadow hints)
  for (var i = 0; i < 90; i++){
    var bx = Math.random() * 512, by = Math.random() * 512;
    var br = 14 + Math.random() * 46;
    var g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    var dark = Math.random() > 0.5;
    g.addColorStop(0, dark ? 'rgba(140,70,60,0.16)' : 'rgba(255,220,205,0.18)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
  }

  // branching veins
  function vein(x, y, ang, len, width, depth){
    ctx.strokeStyle = 'rgba(90,60,130,' + (0.28 - depth * 0.05) + ')';
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    var px = x, py = y;
    var segs = 5 + Math.floor(Math.random() * 4);
    ctx.beginPath();
    ctx.moveTo(px, py);
    for (var s = 0; s < segs; s++){
      ang += (Math.random() - 0.5) * 0.9;
      px += Math.cos(ang) * (len / segs);
      py += Math.sin(ang) * (len / segs);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    if (depth < 2 && Math.random() > 0.35){
      vein(px, py, ang + (Math.random() - 0.5) * 1.4, len * 0.6, Math.max(0.6, width * 0.6), depth + 1);
    }
  }
  for (var v = 0; v < 22; v++){
    vein(Math.random() * 512, Math.random() * 512, Math.random() * Math.PI * 2, 60 + Math.random() * 80, 1.4 + Math.random() * 1.4, 0);
  }

  var tex = new THREE.CanvasTexture(c);
  return tex;
}

function buildTireTexture(){
  var c = document.createElement('canvas');
  c.width = 256; c.height = 96;
  var ctx = c.getContext('2d');
  ctx.fillStyle = '#0c0b10';
  ctx.fillRect(0, 0, 256, 96);
  var blocks = 28;
  for (var i = 0; i < blocks; i++){
    var x = (i / blocks) * 256;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(x, 10, 256 / blocks * 0.5, 76);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(x + 256 / blocks * 0.5, 10, 256 / blocks * 0.18, 76);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, 256, 6);
  ctx.fillRect(0, 90, 256, 6);
  var tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function buildWheelFaceTexture(){
  var c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  var ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 256, 256);
  var cx = 128, cy = 128;

  var outer = ctx.createRadialGradient(cx, cy, 70, cx, cy, 122);
  outer.addColorStop(0, '#3a3d46');
  outer.addColorStop(1, '#111218');
  ctx.fillStyle = outer;
  ctx.beginPath(); ctx.arc(cx, cy, 122, 0, Math.PI * 2); ctx.fill();

  var spokes = 5;
  for (var i = 0; i < spokes; i++){
    var a = (i / spokes) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    var g = ctx.createLinearGradient(0, -110, 0, -30);
    g.addColorStop(0, '#c9cdd6');
    g.addColorStop(1, '#5a5d68');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-9, -108);
    ctx.lineTo(9, -108);
    ctx.lineTo(15, -30);
    ctx.lineTo(-15, -30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  var hub = ctx.createRadialGradient(cx, cy, 4, cx, cy, 34);
  hub.addColorStop(0, '#e7e9ee');
  hub.addColorStop(1, '#4a4d57');
  ctx.fillStyle = hub;
  ctx.beginPath(); ctx.arc(cx, cy, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#20222a';
  ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();

  return new THREE.CanvasTexture(c);
}

/* ---------- helix spring curve ---------- */
function HelixCurve(radius, height, turns){
  THREE.Curve.call(this);
  this.radius = radius;
  this.height = height;
  this.turns = turns;
}
HelixCurve.prototype = Object.create(THREE.Curve.prototype);
HelixCurve.prototype.constructor = HelixCurve;
HelixCurve.prototype.getPoint = function(t){
  var angle = t * Math.PI * 2 * this.turns;
  var x = Math.cos(angle) * this.radius;
  var z = Math.sin(angle) * this.radius;
  var y = t * this.height - this.height / 2;
  return new THREE.Vector3(x, y, z);
};

/* beam mesh stretched between two points, e.g. control arms */
function beamBetween(p1, p2, thickness, mat){
  var dir = new THREE.Vector3().subVectors(p2, p1);
  var len = dir.length();
  var mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  var geo = new THREE.BoxGeometry(len, thickness, thickness);
  var mesh = new THREE.Mesh(geo, mat);
  mesh.position.copy(mid);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.clone().normalize());
  return mesh;
}

/* ---------- build the brain-car mesh ---------- */
function buildCar(){
  carGroup = new THREE.Group();
  var metalMat = new THREE.MeshStandardMaterial({ color: 0x2a2c34, roughness: 0.4, metalness: 0.75 });
  var darkMat  = new THREE.MeshStandardMaterial({ color: 0x121218, roughness: 0.55, metalness: 0.5 });

  // --- BRAIN BODY (anatomical, glossy, low + wide like the reference) ---
  var geo = new THREE.IcosahedronGeometry(50, 5);
  var pos = geo.attributes.position;
  var v = new THREE.Vector3();
  for (var i = 0; i < pos.count; i++){
    v.fromBufferAttribute(pos, i);
    var n = v.clone().normalize();
    var freq = 3.4;
    var noise = Math.sin(n.x * freq * 2.4 + n.y * 4.1) * 0.5
              + Math.sin(n.y * freq * 3.6 + n.z * 2.3) * 0.34
              + Math.sin(n.z * freq * 2.9 + n.x * 3.7) * 0.26
              + Math.sin((n.x + n.y) * freq * 5.2) * 0.14;
    var groove = 0;
    if (Math.abs(n.x) < 0.14){
      groove = -0.5 * (1 - Math.abs(n.x) / 0.14);
    }
    var displaced = 1 + (noise * 0.15) + groove * 0.13;
    v.copy(n).multiplyScalar(50 * displaced);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();

  var brainTex = buildBrainTexture();
  var brainMat = new THREE.MeshPhysicalMaterial({
    map: brainTex,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.9,
    clearcoatRoughness: 0.22,
    sheen: 1,
    sheenColor: new THREE.Color(0xffb6a3)
  });
  brainMesh = new THREE.Mesh(geo, brainMat);
  brainMesh.position.y = 14;
  brainMesh.scale.set(1.15, 0.72, 0.98);
  carGroup.add(brainMesh);

  // small sensor / camera bump on top, front
  var sensorBase = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 12), darkMat);
  sensorBase.position.set(18, 46, 0);
  carGroup.add(sensorBase);
  var lens = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 4, 12), metalMat);
  lens.rotation.z = Math.PI / 2;
  lens.position.set(24, 46, 0);
  carGroup.add(lens);

  // slim headlight bar, low front
  var hlMat = new THREE.MeshStandardMaterial({ color: 0xfff6ea, emissive: 0xfff2df, emissiveIntensity: 1.8 });
  var headlight = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 30), hlMat);
  headlight.position.set(62, -4, 0);
  carGroup.add(headlight);

  // tiny ember taillight, low rear
  var tlMat = new THREE.MeshStandardMaterial({ color: 0xff5a36, emissive: 0xff5a36, emissiveIntensity: 1.2 });
  var taillight = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 26), tlMat);
  taillight.position.set(-62, -2, 0);
  carGroup.add(taillight);

  // --- UNDERBODY SPINE ---
  var spine = new THREE.Mesh(new THREE.BoxGeometry(120, 8, 14), metalMat);
  spine.position.set(0, -10, 0);
  carGroup.add(spine);

  // --- WHEELS + EXPOSED SUSPENSION ---
  var tireTex = buildTireTexture();
  var tireMat = new THREE.MeshStandardMaterial({ map: tireTex, roughness: 0.85, metalness: 0.05 });
  var wheelGeo = new THREE.CylinderGeometry(24, 24, 17, 28);
  wheelGeo.rotateX(Math.PI / 2);

  var faceTex = buildWheelFaceTexture();
  var faceMat = new THREE.MeshStandardMaterial({ map: faceTex, roughness: 0.4, metalness: 0.7 });
  var faceGeo = new THREE.CircleGeometry(19.5, 24);

  var springMat = new THREE.MeshStandardMaterial({ color: 0xb9bdc8, roughness: 0.35, metalness: 0.85 });

  var offsets = [
    { x:  46, z:  40, front: true  },
    { x:  46, z: -40, front: true  },
    { x: -46, z:  36, front: false },
    { x: -46, z: -36, front: false }
  ];

  offsets.forEach(function(o){
    var side = o.z > 0 ? 1 : -1;

    var wheel = new THREE.Mesh(wheelGeo, tireMat);
    wheel.position.set(o.x, -20, o.z);
    carGroup.add(wheel);

    var faceOuter = new THREE.Mesh(faceGeo, faceMat);
    faceOuter.position.set(0, 0, side * 8.6);
    faceOuter.rotation.y = side > 0 ? 0 : Math.PI;
    wheel.add(faceOuter);

    // coil spring
    var spring = new THREE.Mesh(new THREE.TubeGeometry(new HelixCurve(9, 26, 4.2), 60, 1.7, 8, false), springMat);
    spring.position.set(o.x, -6, o.z * 0.72);
    carGroup.add(spring);

    // damper body through the coil
    var damper = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 30, 8), metalMat);
    damper.position.set(o.x, -6, o.z * 0.72);
    carGroup.add(damper);

    // lower control arm from spine to hub
    var arm = beamBetween(
      new THREE.Vector3(o.x * 0.35, -12, 0),
      new THREE.Vector3(o.x, -20, o.z),
      3.4, metalMat
    );
    carGroup.add(arm);

    wheels.push({ mesh: wheel, front: o.front, side: side, offset: o });
  });

  // soft grounding shadow
  var shadowTex = buildShadowTexture();
  var shadowMat = new THREE.SpriteMaterial({ map: shadowTex, transparent: true, opacity: 0.45, depthWrite: false });
  var shadowSprite = new THREE.Sprite(shadowMat);
  shadowSprite.scale.set(190, 78, 1);
  shadowSprite.position.y = -34;
  carGroup.add(shadowSprite);

  carGroup.scale.setScalar(carScaleForViewport());
  scene.add(carGroup);
}

function carScaleForViewport(){
  var w = window.innerWidth;
  if (w < 540) return 0.6;
  if (w < 900) return 0.78;
  return 1;
}

function buildShadowTexture(){
  var c = document.createElement('canvas');
  c.width = 128; c.height = 64;
  var ctx = c.getContext('2d');
  var grad = ctx.createRadialGradient(64, 32, 4, 64, 32, 60);
  grad.addColorStop(0, 'rgba(20,10,35,0.5)');
  grad.addColorStop(1, 'rgba(20,10,35,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 64);
  return new THREE.CanvasTexture(c);
}

function buildSmokeTexture(){
  var c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  var ctx = c.getContext('2d');
  var grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255,247,240,0.9)');
  grad.addColorStop(0.5, 'rgba(240,225,235,0.42)');
  grad.addColorStop(1, 'rgba(240,225,235,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();
  smokeTexture = new THREE.CanvasTexture(c);
}

/* ---------- smoke particles ---------- */
function spawnSmoke(worldPos, intensity){
  if (smokePool.length >= MAX_SMOKE) return;
  var mat = new THREE.SpriteMaterial({
    map: smokeTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.55 * intensity
  });
  var sprite = new THREE.Sprite(mat);
  var s = 14 + Math.random() * 10;
  sprite.scale.set(s, s, 1);
  sprite.position.set(
    worldPos.x + (Math.random() - 0.5) * 8,
    worldPos.y + (Math.random() - 0.5) * 6,
    worldPos.z + (Math.random() - 0.5) * 8
  );
  scene.add(sprite);
  smokePool.push({
    sprite: sprite,
    life: 0,
    maxLife: 0.9 + Math.random() * 0.5,
    vx: (Math.random() - 0.5) * 22,
    vy: 14 + Math.random() * 14,
    vz: (Math.random() - 0.5) * 22,
    growTo: s * (2.4 + Math.random() * 1.2)
  });
}

function updateSmoke(dt){
  for (var i = smokePool.length - 1; i >= 0; i--){
    var p = smokePool[i];
    p.life += dt;
    var t = p.life / p.maxLife;
    if (t >= 1){
      scene.remove(p.sprite);
      p.sprite.material.dispose();
      smokePool.splice(i, 1);
      continue;
    }
    p.sprite.position.x += p.vx * dt;
    p.sprite.position.y += p.vy * dt;
    p.sprite.position.z += p.vz * dt;
    var scale = p.sprite.scale.x + (p.growTo - p.sprite.scale.x) * dt * 1.6;
    p.sprite.scale.set(scale, scale, 1);
    p.sprite.material.opacity = 0.55 * (1 - t);
  }
}

/* ---------- per-frame update ---------- */
function updateCarScreenAnchor(){
  var scrollFrac = window.scrollY / Math.max(1, (Road.docHeight - window.innerHeight));
  scrollFrac = Math.max(0, Math.min(1, scrollFrac));
  var fromVh = 0.4, toVh = 0.62;
  carState.screenYpx = window.innerHeight * (fromVh + (toVh - fromVh) * scrollFrac);
  carState.worldYTarget = (window.innerHeight / 2 - carState.screenYpx) * 0.62;
}

function updateCar(dt, elapsed){
  var scrollY = window.scrollY;
  var docY = scrollY + carState.screenYpx;

  carState.targetX = Road.xAt(docY);
  carState.x += (carState.targetX - carState.x) * Math.min(1, dt * 6);

  var slope = Road.slopeAt(docY);
  var targetYaw = Math.atan(slope * 2.2);
  carState.yaw += (targetYaw - carState.yaw) * Math.min(1, dt * 5);

  var targetBank = -targetYaw * 0.9;
  carState.bank += (targetBank - carState.bank) * Math.min(1, dt * 5);

  var dScroll = scrollY - carState.lastScrollY;
  carState.lastScrollY = scrollY;
  var instSpeed = Math.min(60, Math.abs(dScroll) / Math.max(dt, 0.001) / 30);
  carState.smoothSpeed += (instSpeed - carState.smoothSpeed) * Math.min(1, dt * 4);

  var scale = carScaleForViewport();
  carGroup.scale.setScalar(scale);

  var worldX = carState.x - Road.viewportW / 2;
  var bobY = Math.sin(elapsed * 2.1) * 3 + Math.sin(elapsed * 5.3) * 1.1;
  var baseY = typeof carState.worldYTarget === 'number' ? carState.worldYTarget : 0;
  carGroup.position.set(worldX, baseY + bobY, 0);
  carGroup.rotation.y = -carState.yaw;
  carGroup.rotation.z = carState.bank * 0.5;
  carGroup.rotation.x = Math.sin(elapsed * 1.7) * 0.01;

  // wheel spin
  var spin = (dScroll * 0.02) + carState.smoothSpeed * 0.15 + 0.02;
  wheels.forEach(function(w){
    w.mesh.rotation.z += spin;
  });

  // engine light pulse tied to speed
  engineLight.intensity = 0.5 + carState.smoothSpeed * 0.9 + Math.sin(elapsed * 6) * 0.05;

  // smoke emission: idle trickle + burst with speed, from rear wheels
  var emitChance = 0.06 + carState.smoothSpeed * 0.5;
  wheels.forEach(function(w){
    if (w.front) return;
    if (Math.random() < emitChance * dt * 12){
      var local = new THREE.Vector3(w.offset.x, -18, w.offset.z);
      var worldPos = local.applyMatrix4(carGroup.matrixWorld);
      spawnSmoke(worldPos, Math.min(1, 0.35 + carState.smoothSpeed * 0.6));
    }
  });
}

/* ---------- render loop ---------- */
var threeReady = false;
function animate(){
  requestAnimationFrame(animate);
  if (!threeReady) return;
  var dt = Math.min(0.05, clock.getDelta());
  var elapsed = clock.getElapsedTime();
  updateCarScreenAnchor();
  updateCar(dt, elapsed);
  updateSmoke(dt);
  renderer.render(scene, camera);
}

/* ============================================================
   INIT
   ============================================================ */
function init(){
  layoutScene();
  measureDarkZone();
  updateNav();
  updateSkidReveal();

  if (!reduceMotion && window.WebGLRenderingContext){
    try {
      initThree();
      threeReady = true;
      animate();
    } catch (e){
      canvas.style.display = 'none';
    }
  } else {
    canvas.style.display = 'none';
  }

  var ticking = false;
  window.addEventListener('scroll', function(){
    if (!ticking){
      requestAnimationFrame(function(){
        updateNav();
        updateSkidReveal();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      layoutScene();
      measureDarkZone();
      updateNav();
      updateSkidReveal();
    }, 150);
  });
}

if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
