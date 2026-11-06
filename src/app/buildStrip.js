import { TEMPLATES, COLORS } from './effects';

const loadImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

// preenche o espaço cortando o excesso, sem distorcer
function drawCover(ctx, img, x, y, w, h) {
  const r = Math.max(w / img.width, h / img.height);
  const sw = w / r;
  const sh = h / r;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

// coração contido dentro da caixa (x, y, w, h)
function heartPath(x, y, w, h) {
  const p = new Path2D();
  const t = h * 0.3;
  p.moveTo(x + w / 2, y + t);
  p.bezierCurveTo(x + w / 2, y, x, y, x, y + t);
  p.bezierCurveTo(x, y + (h + t) / 2, x + w / 2, y + h * 0.8, x + w / 2, y + h);
  p.bezierCurveTo(x + w / 2, y + h * 0.8, x + w, y + (h + t) / 2, x + w, y + t);
  p.bezierCurveTo(x + w, y, x + w / 2, y, x + w / 2, y + t);
  p.closePath();
  return p;
}

// aleatório com seed: preview e download saem iguais
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// stickers desenhados em código (centrados em 0,0)
function drawSticker(ctx, kind, size, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1.5;

  if (kind === 'heart') {
    const p = heartPath(-size / 2, -size / 2, size, size);
    ctx.fill(p);
    ctx.stroke(p);
  } else if (kind === 'star') {
    const spikes = 5;
    const outer = size / 2;
    const inner = outer * 0.45;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (Math.PI / spikes) * i - Math.PI / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (kind === 'bow') {
    const w = size / 2;
    const h = size / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-w, -h * 1.6, -w, 0);
    ctx.quadraticCurveTo(-w, h * 1.6, 0, 0);
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(w, -h * 1.6, w, 0);
    ctx.quadraticCurveTo(w, h * 1.6, 0, 0);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.09, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStickers(ctx, t, c, W, H, seed, k) {
  const rand = seeded(seed);
  const [minS, maxS] = t.stickerSize || [26, 56];
  const palette = t.stickerColors || [c.border];
  for (let i = 0; i < t.stickerCount; i++) {
    const kind = t.stickers[Math.floor(rand() * t.stickers.length)];
    const color = palette[Math.floor(rand() * palette.length)];
    const size = (minS + rand() * (maxS - minS)) * k;
    const x = size + rand() * (W - size * 2);
    const y = size + rand() * (H - size * 2);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rand() - 0.5) * 1.2);
    drawSticker(ctx, kind, size, color);
    ctx.restore();
  }
}

/**
 * Monta a tira final.
 * photos: array de dataURLs, na ordem em que aparecem (de cima pra baixo)
 */
export async function buildStrip(
  photos,
  { templateKey = 'classic', colorKey, filterCss = 'none', seed = 1, photoSize = 560 } = {},
) {
  const t = TEMPLATES[templateKey];
  const c = COLORS[colorKey || t.defaultColor];
  const imgs = await Promise.all(photos.map(loadImage));

  const k = photoSize / 560; // escala (previews pequenos usam k < 1)
  const PW = photoSize;
  const PH = photoSize;
  const pad = 40 * k;
  const gap = t.gap * k;
  const bw = t.borderWidth * k;
  const W = PW + pad * 2;
  const H = pad * 2 + imgs.length * PH + (imgs.length - 1) * gap;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, W, H);

  if (t.stickers && t.decor === 'under') drawStickers(ctx, t, c, W, H, seed, k);

  imgs.forEach((img, i) => {
    const x = pad;
    const y = pad + i * (PH + gap);
    const shape = t.slot === 'heart' ? heartPath(x, y, PW, PH) : null;

    ctx.save();
    if (shape) {
      ctx.clip(shape);
    } else {
      ctx.beginPath();
      ctx.rect(x, y, PW, PH);
      ctx.clip();
    }
    ctx.filter = filterCss;
    drawCover(ctx, img, x, y, PW, PH);
    ctx.restore();

    ctx.lineWidth = bw;
    ctx.strokeStyle = c.border;
    if (shape) ctx.stroke(shape);
    else ctx.strokeRect(x, y, PW, PH);
  });

  // contorno externo
  ctx.lineWidth = bw * 2;
  ctx.strokeStyle = c.border;
  ctx.strokeRect(0, 0, W, H);

  if (t.stickers && t.decor === 'over') drawStickers(ctx, t, c, W, H, seed, k);

  return canvas.toDataURL('image/png');
}

// fotos cinza para o preview dos templates na tela inicial
export function placeholderPhotos(n) {
  const c = document.createElement('canvas');
  c.width = 8;
  c.height = 8;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#7a7a7a';
  ctx.fillRect(0, 0, 8, 8);
  const url = c.toDataURL();
  return Array.from({ length: n }, () => url);
}