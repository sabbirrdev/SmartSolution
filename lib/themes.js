export const THEMES = {
  ocean: { name: 'Ocean Blue', key: 'ocean', accent: '#2563eb', accent2: '#0891b2' },
  cream: { name: 'Warm Cream', key: 'cream', accent: '#b7791f', accent2: '#d69e2e' },
  rose: { name: 'Soft Rose', key: 'rose', accent: '#db2777', accent2: '#e11d48' },
  lavender: { name: 'Lavender', key: 'lavender', accent: '#7c3aed', accent2: '#a855f7' },
  mint: { name: 'Mint', key: 'mint', accent: '#059669', accent2: '#14b8a6' },
  dark: { name: 'Studio Dark', key: 'dark', accent: '#22d3ee', accent2: '#34d399' },
  graphite: { name: 'Graphite Blue', key: 'graphite', accent: '#475569', accent2: '#3b82f6' },
};

export const DEFAULT_THEME = 'ocean';
export function getSafeTheme(value) { return THEMES[value] ? value : DEFAULT_THEME; }
