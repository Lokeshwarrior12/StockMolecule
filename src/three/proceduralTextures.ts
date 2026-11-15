import * as THREE from 'three';

function hash2d(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

export function createDesertGroundTextures(maxAnisotropy: number): {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const cCtx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  // Base warm New Mexico ochre sand
  cCtx.fillStyle = '#8b5732';
  cCtx.fillRect(0, 0, size, size);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  // Wind-swept sand ripple bands
  for (let y = 0; y < size; y += 2) {
    const ripple = Math.sin(y * 0.14) * 14 + Math.cos(y * 0.045) * 9;
    const tone = Math.round(128 + ripple);
    bCtx.fillStyle = `rgb(${tone},${tone},${tone})`;
    bCtx.fillRect(0, y, size, 2);

    const r = Math.min(255, Math.max(0, 142 + Math.round(ripple * 0.8)));
    const g = Math.min(255, Math.max(0, 88 + Math.round(ripple * 0.5)));
    const b = Math.min(255, Math.max(0, 50 + Math.round(ripple * 0.3)));
    cCtx.fillStyle = `rgba(${r},${g},${b},0.45)`;
    cCtx.fillRect(0, y, size, 2);
  }

  // Mineral grit & desert pebbles
  for (let i = 0; i < 4500; i++) {
    const px = Math.floor(hash2d(i, 1) * size);
    const py = Math.floor(hash2d(i, 2) * size);
    const sz = 1 + Math.floor(hash2d(i, 3) * 2.5);
    const dark = hash2d(i, 4) > 0.5;
    cCtx.fillStyle = dark ? 'rgba(65, 36, 20, 0.25)' : 'rgba(218, 152, 92, 0.2)';
    cCtx.fillRect(px, py, sz, sz);
    bCtx.fillStyle = dark ? 'rgba(60, 60, 60, 0.35)' : 'rgba(210, 210, 210, 0.35)';
    bCtx.fillRect(px, py, sz, sz);
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(18, 18);
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(18, 18);
  bumpMap.anisotropy = maxAnisotropy;

  return { map, bumpMap };
}

export function createRvHullTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Weathered cream-beige motorhome aluminum paint
  ctx.fillStyle = '#d4c39c';
  ctx.fillRect(0, 0, w, h);

  // Subtle horizontal paneling seams
  ctx.strokeStyle = 'rgba(70, 52, 34, 0.16)';
  ctx.lineWidth = 1.5;
  for (let y = 24; y < h; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Iconic 80s amber / rust / dark-brown desert stripes
  ctx.fillStyle = '#c46f26';
  ctx.fillRect(0, 134, w, 14);
  ctx.fillStyle = '#8b4319';
  ctx.fillRect(0, 152, w, 10);
  ctx.fillStyle = '#532a14';
  ctx.fillRect(0, 166, w, 7);

  // Dust & sun-bleached patina along lower skirt
  const grad = ctx.createLinearGradient(0, 185, 0, h);
  grad.addColorStop(0, 'rgba(130, 82, 46, 0.0)');
  grad.addColorStop(1, 'rgba(98, 59, 32, 0.55)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 185, w, h - 185);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 16, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(10, 6, 4, 0.78)');
  grad.addColorStop(0.55, 'rgba(10, 6, 4, 0.36)');
  grad.addColorStop(1, 'rgba(10, 6, 4, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSmokeSpriteTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  grad.addColorStop(0.45, 'rgba(200, 245, 210, 0.35)');
  grad.addColorStop(1, 'rgba(120, 210, 140, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
