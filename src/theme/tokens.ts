export const colors = {
  ink: '#000000',
  paper: '#FFFFFF',
  porcelain: '#F5F4F1',
  line: '#E6E3DD',
  stone: '#6B6B6B',
  gold: '#B8975A',
  goldDeep: '#8A6A35',
} as const;

export const space = (n: number) => n * 8;
export const margin = 24;
export const radius = { card: 4, pill: 999 } as const;
export const maxWidth = 520;
