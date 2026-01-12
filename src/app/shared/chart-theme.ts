export interface ChartThemePalette {
  accent: string;
  accentBar: string;
  accentFill: string;
  grid: string;
  tick: string;
  donutBorder: string;
}

export function chartPalette(isDark: boolean): ChartThemePalette {
  if (!isDark) {
    return {
      accent: 'hsl(173 56% 36%)',
      accentBar: 'hsl(173 56% 36% / 0.82)',
      accentFill: 'hsl(173 56% 36% / 0.16)',
      grid: 'hsl(215 16% 46% / 0.2)',
      tick: 'hsl(215 14% 38%)',
      donutBorder: 'transparent',
    };
  }
  return {
    accent: 'hsl(172 58% 58%)',
    accentBar: 'hsl(172 55% 52% / 0.92)',
    accentFill: 'hsl(172 58% 58% / 0.28)',
    grid: 'hsl(215 14% 72% / 0.14)',
    tick: 'hsl(215 12% 78%)',
    donutBorder: 'hsl(222 12% 20%)',
  };
}

export function donutSegmentColors(isDark: boolean): string[] {
  if (!isDark) {
    return [
      'hsl(173 58% 42%)',
      'hsl(199 89% 48%)',
      'hsl(38 92% 50%)',
      'hsl(152 69% 36%)',
      'hsl(215 16% 52%)',
      'hsl(0 72% 51%)',
    ];
  }
  return [
    'hsl(172 60% 54%)',
    'hsl(199 78% 62%)',
    'hsl(38 90% 58%)',
    'hsl(152 58% 48%)',
    'hsl(215 18% 68%)',
    'hsl(0 72% 62%)',
  ];
}
