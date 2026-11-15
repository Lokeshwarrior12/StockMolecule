import * as THREE from 'three';
import {
  createContactShadowTexture,
  createDesertGroundTextures,
  createRvHullTexture,
  createSmokeSpriteTexture,
} from './proceduralTextures';

export interface SmokeEmitterHandle {
  points: THREE.Points;
  update: (dt: number, elapsed: number) => void;
  dispose: () => void;
}

export interface VolatilitySurfaceHandle {
  group: THREE.Group;
  update: (elapsed: number) => void;
  dispose: () => void;
}

export function buildDesertLabRV(maxAnisotropy: number, castShadow: boolean): THREE.Group {
  const group = new THREE.Group();
  group.name = 'DesertLabRV';

  const hullTex = createRvHullTexture(maxAnisotropy);
  const shadowTex = createContactShadowTexture();

  const hullMat = new THREE.MeshStandardMaterial({
    map: hullTex,
    color: 0xffffff,
    roughness: 0.72,
    metalness: 0.08,
  });

  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x26211d,
    roughness: 0.85,
    metalness: 0.15,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd0d6dc,
    roughness: 0.22,
    metalness: 0.9,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x16242b,
    roughness: 0.12,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const amberLightMat = new THREE.MeshStandardMaterial({
    color: 0xffa630,
    emissive: 0xd97706,
    emissiveIntensity: 1.6,
    roughness: 0.2,
    metalness: 0.1,
  });

  // 1. Primary Silhouette: Extruded beveled motorhome body profile
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-3.4, 0.55);
  bodyShape.lineTo(3.3, 0.55);
  bodyShape.lineTo(3.45, 1.45);
  bodyShape.lineTo(2.75, 2.75); // slanted cab nose
  bodyShape.lineTo(-3.25, 2.78);
  bodyShape.lineTo(-3.4, 2.5);
  bodyShape.closePath();

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: 2.15,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.07,
    bevelSegments: 2,
  });
  bodyGeo.translate(0, 0, -1.075);

  // Normalize UVs on ExtrudeGeometry so the iconic amber/ochre stripes wrap cleanly along the RV flank
  const uvAttr = bodyGeo.attributes.uv;
  const posAttr = bodyGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const px = posAttr.getX(i);
    const py = posAttr.getY(i);
    uvAttr.setXY(i, (px + 3.5) / 7.0, (py - 0.5) / 2.4);
  }
  uvAttr.needsUpdate = true;

  const bodyMesh = new THREE.Mesh(bodyGeo, hullMat);
  bodyMesh.castShadow = castShadow;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);

  // 2. Lower chassis skirt & bumpers
  const skirtGeo = new THREE.BoxGeometry(7.05, 0.28, 2.24);
  const skirtMesh = new THREE.Mesh(skirtGeo, darkTrimMat);
  skirtMesh.position.set(0.05, 0.48, 0);
  skirtMesh.castShadow = castShadow;
  group.add(skirtMesh);

  // 3. Angled cab windshield
  const windshieldGeo = new THREE.BoxGeometry(0.12, 0.95, 1.88);
  const windshieldMesh = new THREE.Mesh(windshieldGeo, glassMat);
  windshieldMesh.position.set(3.06, 2.08, 0);
  windshieldMesh.rotation.z = 0.48;
  group.add(windshieldMesh);

  // 4. Side lab windows (left and right)
  const windowGeo = new THREE.BoxGeometry(1.5, 0.65, 2.34);
  const rearWin = new THREE.Mesh(windowGeo, glassMat);
  rearWin.position.set(-1.35, 1.92, 0);
  group.add(rearWin);

  const midWinGeo = new THREE.BoxGeometry(0.95, 0.62, 2.34);
  const midWin = new THREE.Mesh(midWinGeo, glassMat);
  midWin.position.set(0.65, 1.92, 0);
  group.add(midWin);

  // 5. Rooftop HVAC condenser unit
  const acGeo = new THREE.BoxGeometry(1.1, 0.28, 1.05);
  const acMesh = new THREE.Mesh(acGeo, hullMat);
  acMesh.position.set(0.7, 2.98, 0);
  acMesh.castShadow = castShadow;
  group.add(acMesh);

  // 6. Stainless chemical exhaust vent stack on roof
  const stackGeo = new THREE.CylinderGeometry(0.11, 0.14, 0.65, 16);
  const stackMesh = new THREE.Mesh(stackGeo, chromeMat);
  stackMesh.position.set(-1.75, 3.12, 0.28);
  stackMesh.castShadow = castShadow;
  group.add(stackMesh);

  // 7. Side rolled awning rail
  const awningGeo = new THREE.CylinderGeometry(0.09, 0.09, 4.4, 12);
  awningGeo.rotateZ(Math.PI / 2);
  const awningMesh = new THREE.Mesh(awningGeo, chromeMat);
  awningMesh.position.set(-0.35, 2.55, 1.18);
  group.add(awningMesh);

  // 8. Front headlights + grille trim
  const grilleGeo = new THREE.BoxGeometry(0.1, 0.34, 1.4);
  const grilleMesh = new THREE.Mesh(grilleGeo, chromeMat);
  grilleMesh.position.set(3.48, 0.95, 0);
  group.add(grilleMesh);

  const lampGeo = new THREE.BoxGeometry(0.1, 0.2, 0.26);
  const lampL = new THREE.Mesh(lampGeo, amberLightMat);
  lampL.position.set(3.49, 0.96, 0.85);
  const lampR = new THREE.Mesh(lampGeo, amberLightMat);
  lampR.position.set(3.49, 0.96, -0.85);
  group.add(lampL, lampR);

  // 9. Four grounded wheels (rubber tire + chrome hubcap)
  const tireGeo = new THREE.CylinderGeometry(0.46, 0.46, 0.32, 20);
  tireGeo.rotateX(Math.PI / 2);
  const hubGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.34, 14);
  hubGeo.rotateX(Math.PI / 2);

  const wheelPositions: [number, number][] = [
    [2.1, 1.06],
    [2.1, -1.06],
    [-1.95, 1.06],
    [-1.95, -1.06],
  ];
  for (const [wx, wz] of wheelPositions) {
    const tire = new THREE.Mesh(tireGeo, darkTrimMat);
    tire.position.set(wx, 0.46, wz);
    tire.castShadow = castShadow;
    const hub = new THREE.Mesh(hubGeo, chromeMat);
    hub.position.set(wx, 0.46, wz);
    group.add(tire, hub);
  }

  // 10. Grounded radial contact shadow disc (prevents floating look)
  const shadowGeo = new THREE.PlaneGeometry(8.8, 4.6);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.68,
    depthWrite: false,
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.position.set(0, 0.02, 0);
  group.add(shadowDisc);

  return group;
}

export function buildDesertSkyDome(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(165, 28, 18);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uSunDir: { value: new THREE.Vector3(0.42, 0.16, -0.89).normalize() },
    },
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(position);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      varying vec3 vWorldDir;
      uniform vec3 uSunDir;
      void main() {
        float h = clamp(vWorldDir.y, -0.1, 1.0);
        vec3 horizon = vec3(0.68, 0.34, 0.11);   // Burnt New Mexico amber
        vec3 midSky = vec3(0.18, 0.16, 0.19);    // Warm dusk slate
        vec3 zenith = vec3(0.05, 0.08, 0.11);    // Deep night slate

        vec3 col = mix(horizon, midSky, smoothstep(0.0, 0.24, h));
        col = mix(col, zenith, smoothstep(0.22, 0.72, h));

        float sunDot = max(dot(normalize(vWorldDir), uSunDir), 0.0);
        col += vec3(0.95, 0.56, 0.20) * pow(sunDot, 16.0) * 0.45;
        col += vec3(1.0, 0.85, 0.55) * smoothstep(0.996, 0.999, sunDot) * 0.85;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const dome = new THREE.Mesh(geo, mat);
  dome.name = 'DesertSkyDome';
  return dome;
}

export function buildMesaTerrain(maxAnisotropy: number, receiveShadow: boolean): THREE.Group {
  const group = new THREE.Group();
  group.name = 'DesertMesaTerrain';

  const { map, bumpMap } = createDesertGroundTextures(maxAnisotropy);

  // Extended desert floor (no rectangular void cutoffs)
  const groundGeo = new THREE.CircleGeometry(150, 64);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.2,
    color: 0xffffff,
    roughness: 0.92,
    metalness: 0.02,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = receiveShadow;
  group.add(ground);

  // Layered New Mexico red sandstone mesas framing the perimeter
  const mesaMat = new THREE.MeshStandardMaterial({
    color: 0x9b4528,
    bumpMap,
    bumpScale: 0.4,
    roughness: 0.88,
    metalness: 0.04,
  });

  const mesaCapMat = new THREE.MeshStandardMaterial({
    color: 0xb65830,
    roughness: 0.85,
    metalness: 0.03,
  });

  const mesaConfigs = [
    { x: -16, z: -30, rTop: 6.2, rBot: 11.5, h: 11.5, rot: 0.4 },
    { x: -32, z: -20, rTop: 4.4, rBot: 8.8, h: 8.6, rot: 1.2 },
    { x: 24, z: -34, rTop: 7.5, rBot: 14.0, h: 13.5, rot: 0.8 },
    { x: 37, z: -15, rTop: 3.9, rBot: 7.4, h: 7.8, rot: 2.1 },
    { x: -4, z: -46, rTop: 10.5, rBot: 16.8, h: 14.2, rot: 0.2 },
  ];

  mesaConfigs.forEach((m) => {
    const mesaGeo = new THREE.CylinderGeometry(m.rTop, m.rBot, m.h, 11, 2);
    const pos = mesaGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const wobble = 1 + Math.sin(vx * 0.7 + vz * 0.5) * 0.1;
      pos.setXYZ(i, vx * wobble, vy, vz * wobble);
    }
    mesaGeo.computeVertexNormals();
    const mesh = new THREE.Mesh(mesaGeo, mesaMat);
    mesh.position.set(m.x, m.h / 2 - 0.3, m.z);
    mesh.rotation.y = m.rot;
    mesh.receiveShadow = receiveShadow;
    group.add(mesh);

    // Stepped flat sandstone cap shelf for authentic Monument Valley / NM mesa silhouette
    const capGeo = new THREE.CylinderGeometry(m.rTop * 0.82, m.rTop * 0.96, 1.4, 11);
    const cap = new THREE.Mesh(capGeo, mesaCapMat);
    cap.position.set(m.x, m.h + 0.35, m.z);
    cap.rotation.y = m.rot + 0.15;
    group.add(cap);
  });

  // Instanced desert boulders & scrub bushes (> 20 instances)
  const rockGeo = new THREE.DodecahedronGeometry(0.45, 0);
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.05,
  });
  const count = 48;
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, count);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (i % 5) * 0.31;
    const radius = 8.5 + ((i * 7.3) % 28);
    const rx = Math.cos(angle) * radius;
    const rz = Math.sin(angle) * radius;

    dummy.position.set(rx, 0.14, rz);
    dummy.rotation.set((i % 3) * 0.4, angle, (i % 4) * 0.3);
    const s = 0.7 + (i % 5) * 0.22;
    dummy.scale.set(s * 1.2, s * 0.65, s);
    dummy.updateMatrix();
    rocks.setMatrixAt(i, dummy.matrix);

    if (i % 3 === 0) {
      color.setHex(0x4f5a38);
    } else {
      color.setHex(0x8a4d2f).offsetHSL(0, 0, ((i % 4) - 1.5) * 0.04);
    }
    rocks.setColorAt(i, color);
  }
  rocks.instanceMatrix.needsUpdate = true;
  if (rocks.instanceColor) rocks.instanceColor.needsUpdate = true;
  rocks.computeBoundingSphere();
  group.add(rocks);

  return group;
}

export function buildChemicalSmokeSystem(origin: THREE.Vector3): SmokeEmitterHandle {
  const count = 42;
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    seeds[i] = i / count;
    positions[i * 3] = origin.x;
    positions[i * 3 + 1] = origin.y + (i / count) * 4.5;
    positions[i * 3 + 2] = origin.z;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const sprite = createSmokeSpriteTexture();
  const mat = new THREE.PointsMaterial({
    map: sprite,
    color: 0x5ce04d,
    size: 1.55,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;

  const update = (_dt: number, elapsed: number) => {
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const phase = (seeds[i] + elapsed * 0.16) % 1;
      const rise = phase * 5.8;
      const swayX = Math.sin(elapsed * 1.2 + i * 0.7) * (0.14 + phase * 0.75) + phase * 1.1;
      const swayZ = Math.cos(elapsed * 0.9 + i * 0.5) * (0.1 + phase * 0.45);
      posAttr.setXYZ(i, origin.x + swayX, origin.y + rise, origin.z + swayZ);
    }
    posAttr.needsUpdate = true;
  };

  const dispose = () => {
    geo.dispose();
    mat.dispose();
    sprite.dispose();
  };

  return { points, update, dispose };
}

export function buildCrystalMarketLattice(isSoftwareGl: boolean): THREE.Group {
  const group = new THREE.Group();
  group.name = 'CrystalMarketLattice';

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    emissive: 0x0c4a7a,
    emissiveIntensity: 0.75,
    roughness: 0.1,
    metalness: 0.12,
    clearcoat: 1.0,
    transmission: isSoftwareGl ? 0 : 0.82,
    transparent: true,
    opacity: isSoftwareGl ? 0.78 : 0.92,
    ior: 1.8,
    thickness: 1.2,
  });

  const edgeMat = new THREE.LineBasicMaterial({
    color: 0xbae6fd,
    transparent: true,
    opacity: 0.65,
  });

  const emeraldNodeMat = new THREE.MeshStandardMaterial({
    color: 0x52c43a,
    emissive: 0x2a7a1d,
    emissiveIntensity: 0.7,
    roughness: 0.25,
    metalness: 0.4,
  });

  const amberNodeMat = new THREE.MeshStandardMaterial({
    color: 0xe59035,
    emissive: 0x994d0c,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    metalness: 0.5,
  });

  const bondMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.3,
    metalness: 0.85,
  });

  const shardConfigs = [
    { pos: [0, 2.2, 0], scale: [1.0, 2.2, 1.0], rot: [0.1, 0.2, 0.08] },
    { pos: [-1.1, 1.6, 0.5], scale: [0.6, 1.45, 0.6], rot: [0.25, 0.6, -0.3] },
    { pos: [1.15, 1.5, -0.4], scale: [0.55, 1.35, 0.55], rot: [-0.2, -0.4, 0.35] },
    { pos: [0.25, 1.3, 1.05], scale: [0.45, 1.15, 0.45], rot: [0.4, 0.1, 0.15] },
    { pos: [-0.45, 1.4, -0.95], scale: [0.5, 1.25, 0.5], rot: [-0.35, 0.5, -0.2] },
  ];

  const shardGeo = new THREE.OctahedronGeometry(1.0, 0);
  const shardEdges = new THREE.EdgesGeometry(shardGeo);
  for (const cfg of shardConfigs) {
    const shard = new THREE.Mesh(shardGeo, crystalMat);
    shard.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    shard.scale.set(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
    shard.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    const outline = new THREE.LineSegments(shardEdges, edgeMat);
    shard.add(outline);
    group.add(shard);
  }

  // Molecular financial bond rings & factor nodes
  const nodeGeo = new THREE.IcosahedronGeometry(0.28, 1);
  const bondOffsets: [number, number, number, boolean][] = [
    [2.6, 2.5, 0.4, true],
    [-2.5, 2.3, -0.5, true],
    [0.4, 3.6, -1.8, false],
    [-0.7, 1.4, 2.3, false],
    [1.9, 1.2, -1.9, true],
  ];

  for (const [x, y, z, isBull] of bondOffsets) {
    const node = new THREE.Mesh(nodeGeo, isBull ? emeraldNodeMat : amberNodeMat);
    node.position.set(x, y, z);
    group.add(node);

    const curve = new THREE.LineCurve3(new THREE.Vector3(0, 2.0, 0), new THREE.Vector3(x, y, z));
    const tubeGeo = new THREE.TubeGeometry(curve, 8, 0.035, 6, false);
    const bond = new THREE.Mesh(tubeGeo, bondMat);
    group.add(bond);
  }

  return group;
}

export function buildVolatilitySurface(): VolatilitySurfaceHandle {
  const group = new THREE.Group();
  group.name = 'VolatilitySurface';

  const geo = new THREE.PlaneGeometry(11, 8, 36, 28);
  geo.rotateX(-Math.PI / 2);

  const count = geo.attributes.position.count;
  const colors = new Float32Array(count * 3);
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.42,
    metalness: 0.25,
    side: THREE.DoubleSide,
  });

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x86efac,
    wireframe: true,
    transparent: true,
    opacity: 0.16,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const surface = new THREE.Mesh(geo, mat);
  surface.position.set(0, 1.2, 0);
  const wire = new THREE.Mesh(geo, wireMat);
  wire.position.set(0, 1.22, 0);

  group.add(surface, wire);

  const _cLow = new THREE.Color(0x2a7d22);
  const _cMid = new THREE.Color(0xd9822b);
  const _cHigh = new THREE.Color(0xdc2626);
  const _cMix = new THREE.Color();

  const update = (elapsed: number) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const col = geo.attributes.color as THREE.BufferAttribute;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const skew = Math.sin(x * 0.55 + elapsed * 0.9) * 0.65 + Math.cos(z * 0.75 - elapsed * 0.7) * 0.55;
      const smile = (x * x) * 0.032;
      const y = skew + smile;
      pos.setY(i, y);

      const t = THREE.MathUtils.clamp((y + 1.1) / 2.8, 0, 1);
      if (t < 0.5) {
        _cMix.copy(_cLow).lerp(_cMid, t * 2);
      } else {
        _cMix.copy(_cMid).lerp(_cHigh, (t - 0.5) * 2);
      }
      col.setXYZ(i, _cMix.r, _cMix.g, _cMix.b);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    geo.computeVertexNormals();
  };

  update(0);

  const dispose = () => {
    geo.dispose();
    mat.dispose();
    wireMat.dispose();
  };

  return { group, update, dispose };
}
