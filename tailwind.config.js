/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        gf: {
          canvas: 'hsl(var(--gf-canvas) / <alpha-value>)',
          surface: 'hsl(var(--gf-surface) / <alpha-value>)',
          elevated: 'hsl(var(--gf-elevated) / <alpha-value>)',
          border: 'hsl(var(--gf-border) / <alpha-value>)',
          muted: 'hsl(var(--gf-muted) / <alpha-value>)',
          subtle: 'hsl(var(--gf-subtle) / <alpha-value>)',
          fg: 'hsl(var(--gf-fg) / <alpha-value>)',
          'fg-muted': 'hsl(var(--gf-fg-muted) / <alpha-value>)',
          accent: 'hsl(var(--gf-accent) / <alpha-value>)',
          'accent-fg': 'hsl(var(--gf-accent-fg) / <alpha-value>)',
          warn: 'hsl(var(--gf-warn) / <alpha-value>)',
          danger: 'hsl(var(--gf-danger) / <alpha-value>)',
          ok: 'hsl(var(--gf-ok) / <alpha-value>)',
          info: 'hsl(var(--gf-info) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Syne"', '"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'gf-kicker': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      maxWidth: {
        'gf-content': '88rem',
      },
      boxShadow: {
        gf: '0 1px 0 hsl(var(--gf-border) / 0.55), 0 12px 40px hsl(var(--gf-shadow) / 0.07)',
        'gf-sm': '0 1px 0 hsl(var(--gf-border) / 0.5), 0 4px 16px hsl(var(--gf-shadow) / 0.05)',
        'gf-inset': 'inset 0 1px 0 hsl(var(--gf-border) / 0.45)',
        'gf-bar': '0 1px 0 hsl(var(--gf-border) / 0.6)',
      },
      borderRadius: {
        gf: '0.625rem',
        'gf-lg': '0.875rem',
        'gf-xl': '1.125rem',
      },
      transitionDuration: {
        gf: '180ms',
      },
      keyframes: {
        'gf-shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'gf-shimmer': 'gf-shimmer 1.35s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
