import { TEMPLATES, COLORS } from './effects';

const loadImage = (src) =>
  new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
// safari/iphone ignoram ctx.filter. yeste funcional: desenha vermelho com
// grayscale e vê se o pixel mudou (só ler a propriedade engana, pois o
// navegador aceita qualquer valor atribuído).
let filterSupport;
function supportsCanvasFilter() {
  if (filterSupport === undefined) {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext('2d');
    ctx.filter = 'grayscale(1)';
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 1, 1);
    const [r, g] = ctx.getImageData(0, 0, 1, 1).data;
    filterSupport = Math.abs(r - g) < 30;
  }
  return filterSupport;
}

// matrizes 3x3 equivalentes às do CSS filter
function colorMatrix(fn, v) {
  if (fn === 'grayscale') {
    const a = 1 - v;
    return [
      0.2126 + 0.7874 * a, 0.7152 - 0.7152 * a, 0.0722 - 0.0722 * a,
      0.2126 - 0.2126 * a, 0.7152 + 0.2848 * a, 0.0722 - 0.0722 * a,
      0.2126 - 0.2126 * a, 0.7152 - 0.7152 * a, 0.0722 + 0.9278 * a,
    ];
  }
  if (fn === 'sepia') {
    const a = 1 - v;
    return [
      0.393 + 0.607 * a, 0.769 - 0.769 * a, 0.189 - 0.189 * a,
      0.349 - 0.349 * a, 0.686 + 0.314 * a, 0.168 - 0.168 * a,
      0.272 - 0.272 * a, 0.534 - 0.534 * a, 0.131 + 0.869 * a,
    ];
  }
  if (fn === 'saturate') {
    return [
      0.213 + 0.787 * v, 0.715 - 0.715 * v, 0.072 - 0.072 * v,
      0.213 - 0.213 * v, 0.715 + 0.285 * v, 0.072 - 0.072 * v,
      0.213 - 0.213 * v, 0.715 - 0.715 * v, 0.072 + 0.928 * v,
    ];
  }
  if (fn === 'hue-rotate') {
    const r = (v * Math.PI) / 180;
    const cos = Math.cos(r);
    const sin = Math.sin(r);
    return [
      0.213 + cos * 0.787 - sin * 0.213, 0.715 - cos * 0.715 - sin * 0.715, 0.072 - cos * 0.072 + sin * 0.928,
      0.213 - cos * 0.213 + sin * 0.143, 0.715 + cos * 0.285 + sin * 0.140, 0.072 - cos * 0.072 - sin * 0.283,
      0.213 - cos * 0.213 - sin * 0.787, 0.715 - cos * 0.715 + sin * 0.715, 0.072 + cos * 0.928 + sin * 0.072,
    ];
  }
  return null;
}

function applyFilterOps(canvas, ops) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;
  const clamp = (n) => (n < 0 ? 0 : n > 255 ? 255 : n);

  for (const [fn, v] of ops) {
    if (fn === 'brightness') {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = clamp(d[i] * v);
        d[i + 1] = clamp(d[i + 1] * v);
        d[i + 2] = clamp(d[i + 2] * v);
      }
    } else if (fn === 'contrast') {
      const off = 127.5 * (1 - v);
      for (let i = 0; i < d.length; i += 4) {
        d[i] = clamp(d[i] * v + off);
        d[i + 1] = clamp(d[i + 1] * v + off);
        d[i + 2] = clamp(d[i + 2] * v + off);
      }
    } else {
      const m = colorMatrix(fn, v);
      if (!m) continue;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        d[i] = clamp(m[0] * r + m[1] * g + m[2] * b);
        d[i + 1] = clamp(m[3] * r + m[4] * g + m[5] * b);
        d[i + 2] = clamp(m[6] * r + m[7] * g + m[8] * b);
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// desenha a foto (cover) já com o filtro, usando o método que o navegador suporta
function drawPhoto(ctx, img, x, y, w, h, filter) {
  const hasFilter = filter && filter.ops.length > 0;
  if (!hasFilter) {
    drawCover(ctx, img, x, y, w, h);
  } else if (supportsCanvasFilter()) {
    ctx.filter = filter.css;
    drawCover(ctx, img, x, y, w, h);
    ctx.filter = 'none';
  } else {
    const tmp = document.createElement('canvas');
    tmp.width = Math.round(w);
    tmp.height = Math.round(h);
    drawCover(tmp.getContext('2d'), img, 0, 0, tmp.width, tmp.height);
    applyFilterOps(tmp, filter.ops);
    ctx.drawImage(tmp, x, y, w, h);
  }
}

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
 * monta a tira final.
 * photos: array de dataURLs, na ordem em que aparecem (de cima pra baixo)
 */
export async function buildStrip(
  photos,
  { templateKey = 'classic', colorKey, filter = null, seed = 1, photoSize = 560 } = {},
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
    drawPhoto(ctx, img, x, y, PW, PH, filter);
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