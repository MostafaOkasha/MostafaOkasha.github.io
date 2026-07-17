import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root element.');

const isLowPower =
  window.innerWidth < 900 ||
  (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4);

const renderer = new THREE.WebGLRenderer({
  antialias: !isLowPower,
  powerPreference: 'high-performance',
  alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowPower ? 0.85 : 1.25));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.autoClear = false;
app.appendChild(renderer.domElement);

if (!renderer.capabilities.isWebGL2) {
  throw new Error('This scene requires WebGL 2 for 3D cloud textures.');
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  44,
  window.innerWidth / window.innerHeight,
  10,
  42000,
);

// Higher overlook with a slightly downward aim. This pushes the mountain lower
// in frame and gives the sunset sky substantially more breathing room.
camera.position.set(-5200, 3100, 8200);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(1900, 1750, -5500);
controls.enableDamping = true;
controls.dampingFactor = 0.035;
controls.enablePan = false;
controls.minDistance = 6400;
controls.maxDistance = 13000;
controls.minPolarAngle = Math.PI * 0.28;
controls.maxPolarAngle = Math.PI * 0.58;
// Keep the authored peak + sunset composition stable. The living motion now
// comes from the atmosphere rather than the entire camera orbiting away.
controls.autoRotate = false;
controls.update();

// Low, visible sun on the open left side of the valley. This direction is also
// used for terrain and cloud lighting, so the disc and highlights stay aligned.
const sunDirection = new THREE.Vector3(-0.08, 0.055, -0.995).normalize();
const sunColor = new THREE.Color(1.0, 0.48, 0.20);
const horizonColor = new THREE.Color(0.82, 0.34, 0.18);
const skyColor = new THREE.Color(0.035, 0.095, 0.19);

const clock = new THREE.Clock();

// -----------------------------------------------------------------------------
// Deterministic CPU noise used to shape the real 3D terrain.
// -----------------------------------------------------------------------------

function hash2(x: number, y: number): number {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function valueNoise2(x: number, y: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = fade(x - x0);
  const ty = fade(y - y0);
  const a = THREE.MathUtils.lerp(hash2(x0, y0), hash2(x0 + 1, y0), tx);
  const b = THREE.MathUtils.lerp(hash2(x0, y0 + 1), hash2(x0 + 1, y0 + 1), tx);
  return THREE.MathUtils.lerp(a, b, ty) * 2 - 1;
}

function fbm2(x: number, y: number, octaves = 6): number {
  let sum = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalization = 0;

  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise2(x * frequency, y * frequency) * amplitude;
    normalization += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }

  return sum / normalization;
}

function ridgedFbm2(x: number, y: number, octaves = 7): number {
  let sum = 0;
  let amplitude = 0.55;
  let frequency = 1;
  let normalization = 0;

  for (let i = 0; i < octaves; i += 1) {
    const n = 1 - Math.abs(valueNoise2(x * frequency, y * frequency));
    sum += n * n * amplitude;
    normalization += amplitude;
    amplitude *= 0.53;
    frequency *= 2.08;
  }

  return sum / normalization;
}

function gaussianPeak(
  x: number,
  z: number,
  centerX: number,
  centerZ: number,
  radiusX: number,
  radiusZ: number,
): number {
  const dx = (x - centerX) / radiusX;
  const dz = (z - centerZ) / radiusZ;
  return Math.exp(-(dx * dx + dz * dz));
}

function valleyCenterX(z: number): number {
  return -1050 + Math.sin(z * 0.00055) * 620 + Math.sin(z * 0.00131) * 190;
}

function terrainHeight(x: number, z: number): number {
  const warpX = fbm2(x * 0.00017 + 9.4, z * 0.00017 - 4.8, 4) * 1350;
  const warpZ = fbm2(x * 0.00015 - 2.3, z * 0.00015 + 8.1, 4) * 1350;
  const nx = (x + warpX) * 0.00034;
  const nz = (z + warpZ) * 0.00034;

  const ridges = Math.pow(ridgedFbm2(nx, nz, 7), 2.25);
  const continental = fbm2(x * 0.00007, z * 0.00007, 5) * 0.5 + 0.5;
  let height = ridges * (1050 + continental * 1050) - 180;

  const mainPeak = gaussianPeak(x, z, 4150, -5700, 3900, 5250);
  const mainPeakDetail = 0.35 + Math.pow(ridgedFbm2(nx * 1.7 + 11, nz * 1.7 - 7, 7), 1.35);
  height += mainPeak * mainPeakDetail * 4850;

  const secondaryPeak = gaussianPeak(x, z, 7200, -1600, 3400, 4200);
  height += secondaryPeak * (0.35 + ridgedFbm2(nx * 1.4 - 4, nz * 1.4 + 2, 6)) * 2450;

  const distantRange = gaussianPeak(x, z, -2200, -10500, 8500, 4500);
  height += distantRange * (0.4 + ridgedFbm2(nx * 1.15, nz * 1.15, 6)) * 1350;

  const valleyX = valleyCenterX(z);
  const valleyDistance = Math.abs(x - valleyX);
  const valleyMask = Math.exp(-Math.pow(valleyDistance / 1450, 2));
  const downstream = THREE.MathUtils.smoothstep(-z, -9000, 8000);
  height -= valleyMask * (900 + downstream * 520);

  const edgeLift = THREE.MathUtils.smoothstep(Math.abs(x), 5500, 9000);
  height += edgeLift * 950;

  return Math.max(-90, height);
}

// -----------------------------------------------------------------------------
// Terrain mesh and physically-inspired material.
// -----------------------------------------------------------------------------

const terrainVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const terrainFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uSunDirection;
  uniform vec3 uSunColor;
  uniform vec3 uSkyColor;
  uniform vec3 uHorizonColor;
  uniform vec3 uCameraPosition;
  uniform float uTime;

  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;

  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(mix(hash31(i + vec3(0,0,0)), hash31(i + vec3(1,0,0)), f.x),
          mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x),
          mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.55;
    for (int i = 0; i < 5; i++) {
      value += noise3(p) * amplitude;
      p = p * 2.03 + vec3(13.1, 7.7, 5.3);
      amplitude *= 0.48;
    }
    return value;
  }

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(uCameraPosition - vWorldPosition);
    float slope = 1.0 - clamp(normal.y, 0.0, 1.0);
    float height = vWorldPosition.y;

    float detail = fbm(vWorldPosition * vec3(0.0018, 0.0011, 0.0018));
    float fineDetail = noise3(vWorldPosition * 0.011 + vec3(0.0, uTime * 0.002, 0.0));
    float strata = 0.5 + 0.5 * sin(
      vWorldPosition.y * 0.017 +
      vWorldPosition.x * 0.006 +
      detail * 8.0
    );

    vec3 deepRock = vec3(0.025, 0.035, 0.052);
    vec3 blueRock = vec3(0.075, 0.095, 0.125);
    vec3 warmRock = vec3(0.19, 0.135, 0.11);
    vec3 oldSnow = vec3(0.58, 0.68, 0.78);
    vec3 freshSnow = vec3(0.94, 0.975, 1.0);

    vec3 rock = mix(deepRock, blueRock, detail);
    rock = mix(rock, warmRock, strata * 0.26);
    rock *= 0.72 + fineDetail * 0.35;

    float snowHeight = 2500.0 + (detail - 0.5) * 820.0;
    float snowByHeight = smoothstep(snowHeight, snowHeight + 760.0, height);
    float snowBySlope = 1.0 - smoothstep(0.24, 0.78, slope);
    float snowMask = clamp(snowByHeight * snowBySlope + snowByHeight * 0.16, 0.0, 1.0);
    snowMask *= smoothstep(0.18, 0.54, fineDetail + normal.y * 0.35);

    vec3 snow = mix(oldSnow, freshSnow, 0.45 + fineDetail * 0.45);
    vec3 albedo = mix(rock, snow, snowMask);

    float diffuse = max(dot(normal, uSunDirection), 0.0);
    float wrappedDiffuse = max((dot(normal, uSunDirection) + 0.28) / 1.28, 0.0);
    float backLight = pow(max(dot(viewDirection, -uSunDirection), 0.0), 5.0);
    float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.5);

    vec3 ambient = mix(vec3(0.045, 0.075, 0.13), uSkyColor, normal.y * 0.42 + 0.28);
    vec3 direct = uSunColor * (diffuse * 1.38 + wrappedDiffuse * 0.18);
    vec3 color = albedo * (ambient + direct);
    color += snow * rim * snowMask * 0.13;
    color += uSunColor * backLight * 0.055;

    float distanceToCamera = length(vWorldPosition - uCameraPosition);
    float distanceFog = smoothstep(5500.0, 23000.0, distanceToCamera);
    float valleyHaze = exp(-max(height, 0.0) / 1150.0) * smoothstep(3000.0, 17000.0, distanceToCamera);
    float haze = clamp(distanceFog * 0.78 + valleyHaze * 0.22, 0.0, 0.88);
    vec3 fogColor = mix(uHorizonColor * 0.48, uSkyColor * 1.35, clamp(height / 7000.0, 0.0, 1.0));
    color = mix(color, fogColor, haze);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function createTerrain(): THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> {
  const width = 19000;
  const depth = 29000;
  const segmentsX = isLowPower ? 180 : 300;
  const segmentsZ = isLowPower ? 280 : 450;
  const geometry = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
  geometry.rotateX(-Math.PI / 2);

  const positions = geometry.attributes.position;
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const z = positions.getZ(i);
    positions.setY(i, terrainHeight(x, z));
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  const material = new THREE.ShaderMaterial({
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    uniforms: {
      uSunDirection: { value: sunDirection },
      uSunColor: { value: sunColor },
      uSkyColor: { value: skyColor },
      uHorizonColor: { value: horizonColor },
      uCameraPosition: { value: camera.position },
      uTime: { value: 0 },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}

const terrain = createTerrain();
scene.add(terrain);

// -----------------------------------------------------------------------------
// Sunset sky dome. The dome follows the camera and never writes depth.
// -----------------------------------------------------------------------------

const skyMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  depthWrite: false,
  depthTest: false,
  uniforms: {
    uSunDirection: { value: sunDirection },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec3 vDirection;
    void main() {
      vDirection = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    uniform vec3 uSunDirection;
    uniform float uTime;
    varying vec3 vDirection;

    float hash31(vec3 p) {
      p = fract(p * 0.1031);
      p += dot(p, p.yzx + 33.33);
      return fract((p.x + p.y) * p.z);
    }

    void main() {
      vec3 direction = normalize(vDirection);
      float elevation = clamp(direction.y * 0.5 + 0.5, 0.0, 1.0);

      vec3 lower = vec3(0.95, 0.31, 0.12);
      vec3 horizon = vec3(0.44, 0.18, 0.20);
      vec3 upper = vec3(0.018, 0.055, 0.13);
      vec3 zenith = vec3(0.006, 0.018, 0.055);

      vec3 color = mix(lower, horizon, smoothstep(0.0, 0.31, elevation));
      color = mix(color, upper, smoothstep(0.22, 0.70, elevation));
      color = mix(color, zenith, smoothstep(0.68, 1.0, elevation));

      float sunDot = max(dot(direction, normalize(uSunDirection)), 0.0);
      // Slightly enlarged sunset disc so it reads clearly at desktop scale.
      float sunDisc = smoothstep(0.99910, 0.99972, sunDot);
      float sunCore = smoothstep(0.99978, 0.99994, sunDot);
      float innerGlow = pow(sunDot, 135.0);
      float outerGlow = pow(sunDot, 10.0);
      color += vec3(1.0, 0.38, 0.10) * outerGlow * 0.72;
      color += vec3(1.0, 0.70, 0.34) * innerGlow * 1.55;
      color += vec3(1.0, 0.88, 0.58) * sunDisc * 2.8;
      color += vec3(1.0, 0.98, 0.88) * sunCore * 4.2;

      float stars = step(0.9987, hash31(floor(direction * 900.0 + uTime * 0.00001)));
      stars *= smoothstep(0.44, 0.92, elevation) * (1.0 - outerGlow);
      color += vec3(0.48, 0.65, 0.95) * stars * 0.28;

      gl_FragColor = vec4(color, 1.0);
    }
  `,
});

const sky = new THREE.Mesh(new THREE.SphereGeometry(30000, 48, 24), skyMaterial);
sky.renderOrder = -100;
scene.add(sky);

// -----------------------------------------------------------------------------
// Winding glacial river to anchor the valley and catch the sunset.
// -----------------------------------------------------------------------------

function createRiver(): THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial> {
  const segments = 260;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const z = THREE.MathUtils.lerp(6000, -13200, t);
    const x = valleyCenterX(z) + Math.sin(t * Math.PI * 12) * (35 + t * 80);
    const nextZ = z - 15;
    const nextX = valleyCenterX(nextZ) + Math.sin((t + 0.003) * Math.PI * 12) * (35 + t * 80);
    const tangent = new THREE.Vector2(nextX - x, nextZ - z).normalize();
    const side = new THREE.Vector2(-tangent.y, tangent.x);
    const width = THREE.MathUtils.lerp(145, 45, t) * (0.88 + Math.sin(t * 18) * 0.12);
    const y = terrainHeight(x, z) + 12;

    positions.push(x + side.x * width, y, z + side.y * width);
    positions.push(x - side.x * width, y, z - side.y * width);
    uvs.push(0, t, 1, t);

    if (i < segments) {
      const base = i * 2;
      indices.push(base, base + 2, base + 1, base + 2, base + 3, base + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSunColor: { value: sunColor },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec3 uSunColor;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        float center = 1.0 - abs(vUv.x * 2.0 - 1.0);
        float ripple = sin(vUv.y * 1250.0 - uTime * 1.7 + vWorldPosition.x * 0.012);
        float sparkle = smoothstep(0.78, 1.0, ripple * 0.5 + 0.5);
        sparkle *= 0.45 + 0.55 * hash21(floor(vWorldPosition.xz * 0.035));
        float alpha = pow(center, 0.65) * (0.15 + sparkle * 0.42);
        vec3 color = mix(vec3(0.10, 0.19, 0.26), uSunColor * 1.7, sparkle);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 2;
  return mesh;
}

const river = createRiver();
scene.add(river);

// -----------------------------------------------------------------------------
// A seamless 3D cloud-noise volume. The final clouds are raymarched in screen
// space and clipped against the real terrain depth texture.
// -----------------------------------------------------------------------------

function hash3(x: number, y: number, z: number): number {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function periodicValueNoise3(x: number, y: number, z: number, period: number): number {
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  const fz = Math.floor(z);
  const tx = fade(x - fx);
  const ty = fade(y - fy);
  const tz = fade(z - fz);

  const wrap = (v: number): number => ((v % period) + period) % period;
  const x0 = wrap(fx);
  const y0 = wrap(fy);
  const z0 = wrap(fz);
  const x1 = wrap(fx + 1);
  const y1 = wrap(fy + 1);
  const z1 = wrap(fz + 1);

  const n000 = hash3(x0, y0, z0);
  const n100 = hash3(x1, y0, z0);
  const n010 = hash3(x0, y1, z0);
  const n110 = hash3(x1, y1, z0);
  const n001 = hash3(x0, y0, z1);
  const n101 = hash3(x1, y0, z1);
  const n011 = hash3(x0, y1, z1);
  const n111 = hash3(x1, y1, z1);

  const nx00 = THREE.MathUtils.lerp(n000, n100, tx);
  const nx10 = THREE.MathUtils.lerp(n010, n110, tx);
  const nx01 = THREE.MathUtils.lerp(n001, n101, tx);
  const nx11 = THREE.MathUtils.lerp(n011, n111, tx);
  const nxy0 = THREE.MathUtils.lerp(nx00, nx10, ty);
  const nxy1 = THREE.MathUtils.lerp(nx01, nx11, ty);
  return THREE.MathUtils.lerp(nxy0, nxy1, tz);
}

function createCloudNoiseTexture(size: number): THREE.Data3DTexture {
  const data = new Uint8Array(size * size * size);
  let index = 0;

  for (let z = 0; z < size; z += 1) {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const nx = x / size;
        const ny = y / size;
        const nz = z / size;
        const n =
          periodicValueNoise3(nx * 4, ny * 4, nz * 4, 4) * 0.54 +
          periodicValueNoise3(nx * 8, ny * 8, nz * 8, 8) * 0.29 +
          periodicValueNoise3(nx * 16, ny * 16, nz * 16, 16) * 0.17;
        data[index] = Math.round(Math.pow(THREE.MathUtils.clamp(n, 0, 1), 1.12) * 255);
        index += 1;
      }
    }
  }

  const texture = new THREE.Data3DTexture(data, size, size, size);
  texture.format = THREE.RedFormat;
  texture.type = THREE.UnsignedByteType;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapR = THREE.RepeatWrapping;
  texture.unpackAlignment = 1;
  texture.needsUpdate = true;
  return texture;
}

const cloudNoise = createCloudNoiseTexture(isLowPower ? 48 : 64);

const renderTarget = new THREE.WebGLRenderTarget(1, 1, {
  type: renderer.extensions.has('EXT_color_buffer_float') ? THREE.HalfFloatType : THREE.UnsignedByteType,
  format: THREE.RGBAFormat,
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  depthBuffer: true,
  stencilBuffer: false,
});
renderTarget.texture.colorSpace = THREE.LinearSRGBColorSpace;
renderTarget.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedIntType);
renderTarget.depthTexture.format = THREE.DepthFormat;
renderTarget.depthTexture.minFilter = THREE.NearestFilter;
renderTarget.depthTexture.magFilter = THREE.NearestFilter;

const postScene = new THREE.Scene();
const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const cloudVertexShader = /* glsl */ `
  out vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const cloudFragmentShader = /* glsl */ `
  precision highp float;
  precision highp sampler3D;

  uniform sampler2D uSceneColor;
  uniform sampler2D uSceneDepth;
  uniform sampler3D uNoise;
  uniform mat4 uInverseProjection;
  uniform mat4 uCameraWorldMatrix;
  uniform vec3 uCameraPosition;
  uniform vec3 uSunDirection;
  uniform float uNear;
  uniform float uFar;
  uniform float uTime;
  uniform float uFrame;
  uniform int uSteps;
  uniform float uExposure;
  uniform float uLowCloudAmount;
  uniform float uMidCloudAmount;
  uniform float uHighCloudAmount;

  in vec2 vUv;
  out vec4 outColor;

  float remap(float value, float oldMin, float oldMax, float newMin, float newMax) {
    return newMin + (value - oldMin) * (newMax - newMin) / max(oldMax - oldMin, 0.0001);
  }

  float saturate(float value) {
    return clamp(value, 0.0, 1.0);
  }

  float interleavedGradientNoise(vec2 pixel, float frame) {
    pixel += frame * vec2(47.0, 17.0) * 0.01;
    return fract(52.9829189 * fract(0.06711056 * pixel.x + 0.00583715 * pixel.y));
  }

  vec3 reconstructWorldPosition(float depth) {
    vec4 clip = vec4(vUv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    vec4 view = uInverseProjection * clip;
    view /= view.w;
    return (uCameraWorldMatrix * view).xyz;
  }

  vec3 worldRayDirection() {
    vec4 clip = vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
    vec4 view = uInverseProjection * clip;
    view = vec4(normalize(view.xyz / view.w), 0.0);
    return normalize((uCameraWorldMatrix * view).xyz);
  }

  bool intersectVerticalSlab(
    vec3 rayOrigin,
    vec3 rayDirection,
    float minimumY,
    float maximumY,
    float maximumDistance,
    out float startDistance,
    out float endDistance
  ) {
    if (abs(rayDirection.y) < 0.00001) {
      if (rayOrigin.y < minimumY || rayOrigin.y > maximumY) return false;
      startDistance = 0.0;
      endDistance = maximumDistance;
      return true;
    }

    float t0 = (minimumY - rayOrigin.y) / rayDirection.y;
    float t1 = (maximumY - rayOrigin.y) / rayDirection.y;
    startDistance = max(min(t0, t1), 0.0);
    endDistance = min(max(t0, t1), maximumDistance);
    return endDistance > startDistance;
  }

  float sampleNoise(vec3 coordinate) {
    float large = texture(uNoise, coordinate).r;
    float medium = texture(uNoise, coordinate * 2.07 + vec3(0.31, 0.17, 0.53)).r;
    float detail = texture(uNoise, coordinate * 4.11 + vec3(0.67, 0.29, 0.11)).r;
    return large * 0.58 + medium * 0.29 + detail * 0.13;
  }

  float valleyCenter(float z) {
    return -1050.0 + sin(z * 0.00055) * 620.0 + sin(z * 0.00131) * 190.0;
  }

  float cloudDensity(vec3 worldPosition) {
    float density = 0.0;

    // Sparse low valley fog. It stays mostly inside the river corridor instead
    // of filling the entire foreground and hiding the terrain.
    if (worldPosition.y >= 260.0 && worldPosition.y < 1220.0) {
      float h = remap(worldPosition.y, 260.0, 1220.0, 0.0, 1.0);
      float verticalProfile = smoothstep(0.02, 0.20, h) * (1.0 - smoothstep(0.48, 0.92, h));
      vec3 wind = vec3(0.0036, 0.0002, 0.0011) * uTime;
      vec3 coordinate = worldPosition * vec3(0.00032, 0.00072, 0.00032) + wind;
      float shape = sampleNoise(coordinate);
      float weather = texture(uNoise, vec3(worldPosition.xz * 0.000055, 0.18) + wind * 0.16).r;
      float valley = 1.0 - smoothstep(1100.0, 3500.0, abs(worldPosition.x - valleyCenter(worldPosition.z)));
      density = smoothstep(0.61 - weather * 0.065, 0.82, shape) * verticalProfile;
      density *= mix(0.025, 0.44, valley) * uLowCloudAmount;
    }

    // Broken mid-level banks. Large clear gaps preserve the silhouette and the
    // distant valley while the layer still visibly rolls across the scene.
    else if (worldPosition.y >= 1220.0 && worldPosition.y < 2920.0) {
      float h = remap(worldPosition.y, 1220.0, 2920.0, 0.0, 1.0);
      float verticalProfile = smoothstep(0.04, 0.18, h) * (1.0 - smoothstep(0.56, 0.94, h));
      vec3 wind = vec3(0.0021, 0.00025, -0.0014) * uTime;
      vec3 coordinate = worldPosition * vec3(0.00022, 0.00042, 0.00022) + wind + vec3(0.1, 0.4, 0.7);
      float shape = sampleNoise(coordinate);
      float weather = texture(uNoise, vec3(worldPosition.xz * 0.000038, 0.44) + wind * 0.13).r;
      density = smoothstep(0.655 - weather * 0.075, 0.86, shape) * verticalProfile;
      density *= 0.40 * uMidCloudAmount;
    }

    // Very thin, fast summit wisps. These animate the upper mountain without
    // turning the sky into an opaque ceiling.
    else if (worldPosition.y >= 2920.0 && worldPosition.y <= 5400.0) {
      float h = remap(worldPosition.y, 2920.0, 5400.0, 0.0, 1.0);
      float verticalProfile = smoothstep(0.02, 0.12, h) * (1.0 - smoothstep(0.64, 0.96, h));
      vec3 wind = vec3(0.0062, -0.00018, 0.0024) * uTime;
      vec3 stretchedPosition = worldPosition * vec3(0.00015, 0.00065, 0.00009);
      float shape = sampleNoise(stretchedPosition + wind + vec3(0.6, 0.2, 0.1));
      float ribbons = 0.5 + 0.5 * sin(worldPosition.x * 0.0007 + worldPosition.z * 0.00034 + uTime * 0.045);
      density = smoothstep(0.69, 0.875, shape + ribbons * 0.035) * verticalProfile;
      density *= 0.26 * uHighCloudAmount;
    }

    return density;
  }

  vec3 cloudLighting(vec3 worldPosition, vec3 rayDirection, float localDensity) {
    float towardSun1 = cloudDensity(worldPosition + uSunDirection * 260.0);
    float towardSun2 = cloudDensity(worldPosition + uSunDirection * 620.0);
    float towardSun3 = cloudDensity(worldPosition + uSunDirection * 1180.0);
    float opticalDepth = towardSun1 * 0.75 + towardSun2 * 0.52 + towardSun3 * 0.34;
    float sunVisibility = exp(-opticalDepth * 2.25);

    float forwardScatter = pow(max(dot(rayDirection, uSunDirection), 0.0), 10.0);
    float silverLining = pow(saturate(1.0 - localDensity), 2.0) * forwardScatter;

    vec3 coolShadow = vec3(0.18, 0.245, 0.34);
    vec3 ambient = vec3(0.36, 0.43, 0.54);
    vec3 warmSun = vec3(1.25, 0.64, 0.31);
    vec3 color = mix(coolShadow, ambient, 0.5 + sunVisibility * 0.22);
    color = mix(color, warmSun, sunVisibility * 0.72);
    color += vec3(1.0, 0.53, 0.24) * silverLining * 1.25;
    return color;
  }

  vec3 acesFilm(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
  }

  void main() {
    vec3 sceneColor = texture(uSceneColor, vUv).rgb;
    float sceneDepth = texture(uSceneDepth, vUv).r;
    vec3 rayOrigin = uCameraPosition;
    vec3 rayDirection = worldRayDirection();

    float maximumDistance = uFar;
    if (sceneDepth < 0.999999) {
      vec3 opaqueWorldPosition = reconstructWorldPosition(sceneDepth);
      maximumDistance = length(opaqueWorldPosition - rayOrigin);
    }

    float startDistance;
    float endDistance;
    vec3 cloudAccumulation = vec3(0.0);
    float transmittance = 1.0;

    if (intersectVerticalSlab(
      rayOrigin,
      rayDirection,
      260.0,
      5400.0,
      maximumDistance,
      startDistance,
      endDistance
    )) {
      float stepLength = (endDistance - startDistance) / float(max(uSteps, 1));
      float jitter = interleavedGradientNoise(gl_FragCoord.xy, uFrame);
      float currentDistance = startDistance + stepLength * jitter;

      for (int i = 0; i < 72; i++) {
        if (i >= uSteps || currentDistance > endDistance || transmittance < 0.018) break;

        vec3 samplePosition = rayOrigin + rayDirection * currentDistance;
        float density = cloudDensity(samplePosition);

        if (density > 0.001) {
          float extinction = density * stepLength * 0.00155;
          float alpha = 1.0 - exp(-extinction);
          vec3 lighting = cloudLighting(samplePosition, rayDirection, density);
          cloudAccumulation += transmittance * alpha * lighting;
          transmittance *= 1.0 - alpha;
        }

        currentDistance += stepLength;
      }
    }

    vec3 color = sceneColor * transmittance + cloudAccumulation;

    // Subtle aerial perspective and cinematic finishing.
    float horizon = pow(1.0 - abs(rayDirection.y), 5.0);
    float sunGlow = pow(max(dot(rayDirection, uSunDirection), 0.0), 18.0);
    color += vec3(0.38, 0.12, 0.045) * horizon * 0.12;
    color += vec3(1.0, 0.29, 0.08) * sunGlow * 0.10;

    float vignette = vUv.x * vUv.y * (1.0 - vUv.x) * (1.0 - vUv.y);
    vignette = pow(vignette * 16.0, 0.19);
    color *= mix(0.58, 1.0, vignette);

    color = acesFilm(color * uExposure);
    color = pow(color, vec3(1.0 / 2.2));
    outColor = vec4(color, 1.0);
  }
`;

const cloudMaterial = new THREE.ShaderMaterial({
  glslVersion: THREE.GLSL3,
  depthWrite: false,
  depthTest: false,
  toneMapped: false,
  uniforms: {
    uSceneColor: { value: renderTarget.texture },
    uSceneDepth: { value: renderTarget.depthTexture },
    uNoise: { value: cloudNoise },
    uInverseProjection: { value: camera.projectionMatrixInverse },
    uCameraWorldMatrix: { value: camera.matrixWorld },
    uCameraPosition: { value: camera.position },
    uSunDirection: { value: sunDirection },
    uNear: { value: camera.near },
    uFar: { value: camera.far },
    uTime: { value: 0 },
    uFrame: { value: 0 },
    uSteps: { value: isLowPower ? 34 : 58 },
    uExposure: { value: 1.16 },

    // Artist controls. Keep these near 1.0 and tune the shader thresholds above
    // for coverage; lower values make each altitude layer more transparent.
    uLowCloudAmount: { value: 0.82 },
    uMidCloudAmount: { value: 0.72 },
    uHighCloudAmount: { value: 0.68 },
  },
  vertexShader: cloudVertexShader,
  fragmentShader: cloudFragmentShader,
});

const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), cloudMaterial);
postQuad.frustumCulled = false;
postScene.add(postQuad);

function resize(): void {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const drawingBufferSize = new THREE.Vector2();
  renderer.getDrawingBufferSize(drawingBufferSize);
  renderTarget.setSize(drawingBufferSize.x, drawingBufferSize.y);
}

window.addEventListener('resize', resize);
resize();

let frame = 0;

function animate(): void {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  frame += 1;

  controls.update();
  sky.position.copy(camera.position);
  skyMaterial.uniforms.uTime.value = time;
  terrain.material.uniforms.uTime.value = time;
  river.material.uniforms.uTime.value = time;

  camera.updateMatrixWorld();
  cloudMaterial.uniforms.uTime.value = time;
  cloudMaterial.uniforms.uFrame.value = frame % 1024;
  cloudMaterial.uniforms.uInverseProjection.value.copy(camera.projectionMatrixInverse);
  cloudMaterial.uniforms.uCameraWorldMatrix.value.copy(camera.matrixWorld);
  cloudMaterial.uniforms.uCameraPosition.value.copy(camera.position);

  renderer.setRenderTarget(renderTarget);
  renderer.setClearColor(0x050914, 1);
  renderer.clear(true, true, true);
  renderer.render(scene, camera);

  renderer.setRenderTarget(null);
  renderer.clear(true, true, true);
  renderer.render(postScene, postCamera);
}

animate();
