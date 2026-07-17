# Living Himalayas — Three.js + TypeScript

A runnable Three.js/Vite environment with:

- Real displaced 3D mountain geometry, not a background image
- A dominant Himalayan-style summit, layered ranges, carved valley, and glacial river
- A stable high-overlook composition with more visible sky
- A visible low sunset disc on the open left side of the valley
- Depth-aware volumetric clouds raymarched from a seamless `Data3DTexture`
- Independently moving low, middle, and high cloud layers
- Sparse cloud coverage with large clear areas around the mountains
- Clouds correctly clipped by mountain geometry through a `DepthTexture`
- Desktop/mobile quality scaling, orbit controls, atmospheric haze, vignette, grain, and HUD

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Main controls

All tuning points are in `src/main.ts`:

- Field of view: `new THREE.PerspectiveCamera(44, ...)`
- Camera height and position: `camera.position.set(-5200, 3100, 8200)`
- Camera aim: `controls.target.set(1900, 1750, -5500)`
- Sunset position: `sunDirection`
- Cloud coverage thresholds: `cloudDensity()`
- Layer opacity: `uLowCloudAmount`, `uMidCloudAmount`, `uHighCloudAmount`
- Cloud movement: the three `wind` variables inside `cloudDensity()`
- Overall cloud opacity: the `extinction` multiplier in the raymarch loop
- Cloud rendering cost: `uSteps`
- Exposure: `uExposure`

To reduce clouds further, lower the three cloud amount uniforms first. For example:

```ts
uLowCloudAmount: { value: 0.60 },
uMidCloudAmount: { value: 0.50 },
uHighCloudAmount: { value: 0.45 },
```

## Production note

The procedural terrain is a self-contained foundation. For real Himalayan geography and photographic fidelity, replace `terrainHeight()` with a licensed high-resolution DEM or an optimized photogrammetry/glTF mountain mesh. Keep the sky, lighting, river, depth-aware cloud compositor, and camera system.
