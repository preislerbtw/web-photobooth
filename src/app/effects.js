// Filtros. Cada um é uma lista de operações:
//  - no canvas moderno viram uma string CSS (ctx.filter)
//  - no Safari/iPhone (sem ctx.filter) são aplicadas pixel a pixel
const makeFilter = (label, ops) => ({
  label,
  ops,
  css: ops.length
    ? ops.map(([fn, v]) => `${fn}(${v}${fn === 'hue-rotate' ? 'deg' : ''})`).join(' ')
    : 'none',
});

export const FILTERS = {
  normal:  makeFilter('Normal',  []),
  bw:      makeFilter('P&B',     [['grayscale', 1], ['contrast', 1.15]]),
  vintage: makeFilter('Vintage', [['sepia', 0.55], ['contrast', 1.1], ['brightness', 0.92], ['saturate', 1.2]]),
  fade:    makeFilter('Fade',    [['contrast', 0.85], ['brightness', 1.1], ['saturate', 0.8]]),
  warm:    makeFilter('Quente',  [['sepia', 0.25], ['saturate', 1.4], ['hue-rotate', -10]]),
};

// Cores da tira (fundo + contorno). Escolhidas depois de tirar as fotos.
export const COLORS = {
  white: { label: 'Branca', bg: '#ffffff', border: '#000000' },
  black: { label: 'Preta',  bg: '#111111', border: '#000000' },
  pink:  { label: 'Rosa',   bg: '#f9a8d4', border: '#9b2c4a' },
  blush: { label: 'Blush',  bg: '#ffd6dc', border: '#9b2c4a' },
  cream: { label: 'Creme',  bg: '#f5ecd7', border: '#3b2f1e' },
  gray:  { label: 'Cinza',  bg: '#d9d3d6', border: '#8f8a8d' },
};

// Templates = formato da tira (escolhidos na tela inicial).
// slot: 'rect' | 'heart'     decor: 'over' (por cima das fotos) | 'under' (atrás)
// stickerColors: null = usa a cor do contorno da cor escolhida
export const TEMPLATES = {
  classic: {
    label: 'Clássico',
    slot: 'rect', tilt: 0, gap: 16, borderWidth: 5,
    defaultColor: 'white',
  },
  tilted: {
    label: 'Inclinado',
    slot: 'rect', tilt: -3, gap: 16, borderWidth: 5,
    defaultColor: 'black',
  },
  hearts: {
    label: 'Corações',
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
    label: 'Estrelas',
    slot: 'rect', tilt: 1, gap: 16, borderWidth: 5,
    defaultColor: 'white',
    decor: 'over', stickers: ['star'], stickerCount: 12,
    stickerSize: [26, 56], stickerColors: ['#e2b93b', '#f0cf5c', '#c99a1f'],
  },
};