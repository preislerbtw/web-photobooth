// Filtros (aplicados com ctx.filter no canvas e com CSS no preview)
export const FILTERS = {
  normal:  { label: 'Normal',  css: 'none' },
  bw:      { label: 'P&B',     css: 'grayscale(1) contrast(1.15)' },
  vintage: { label: 'Vintage', css: 'sepia(0.55) contrast(1.1) brightness(0.92) saturate(1.2)' },
  fade:    { label: 'Fade',    css: 'contrast(0.85) brightness(1.1) saturate(0.8)' },
  warm:    { label: 'Hot',  css: 'sepia(0.25) saturate(1.4) hue-rotate(-10deg)' },
};

// Cores da tira (fundo + contorno). Escolhidas depois de tirar as fotos.
export const COLORS = {
  white: { label: 'White', bg: '#ffffff', border: '#000000' },
  black: { label: 'Black',  bg: '#111111', border: '#000000' },
  pink:  { label: 'Pink',   bg: '#f9a8d4', border: '#9b2c4a' },
  blush: { label: 'Blush',  bg: '#ffd6dc', border: '#9b2c4a' },
  cream: { label: 'Cream',  bg: '#f5ecd7', border: '#3b2f1e' },
  gray:  { label: 'Gray',  bg: '#d9d3d6', border: '#8f8a8d' },
};

// Templates = formato da tira (escolhidos na tela inicial).
// slot: 'rect' | 'heart'     decor: 'over' (por cima das fotos) | 'under' (atrás)
// stickerColors: null = usa a cor do contorno da cor escolhida
export const TEMPLATES = {
  classic: {
    label: 'Classic',
    slot: 'rect', tilt: 0, gap: 16, borderWidth: 5,
    defaultColor: 'white',
  },
  tilted: {
    label: 'Tilted',
    slot: 'rect', tilt: -3, gap: 16, borderWidth: 5,
    defaultColor: 'black',
  },
  hearts: {
    label: 'Hearts',
    slot: 'heart', tilt: 2, gap: 34, borderWidth: 6,
    defaultColor: 'blush',
    decor: 'under', stickers: ['heart', 'bow'], stickerCount: 34,
    stickerSize: [18, 34], stickerColors: null,
  },
  love: {
    label: 'Love',
    slot: 'rect', tilt: -1, gap: 12, borderWidth: 3,
    defaultColor: 'gray',
    decor: 'over', stickers: ['heart', 'bow'], stickerCount: 9,
    stickerSize: [26, 56], stickerColors: ['#e0402f', '#f08a3c', '#d6336c'],
  },
  stars: {
    label: 'Stars',
    slot: 'rect', tilt: 1, gap: 16, borderWidth: 5,
    defaultColor: 'white',
    decor: 'over', stickers: ['star'], stickerCount: 12,
    stickerSize: [26, 56], stickerColors: ['#e2b93b', '#f0cf5c', '#c99a1f'],
  },
};