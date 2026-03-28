/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg:       '#0d0f0e',
        surface:  '#141716',
        surface2: '#1a1e1c',
        border:   '#252b28',
        accent:   '#c8f060',
        accent2:  '#f0a030',
        accent3:  '#60d0f0',
        danger:   '#f05050',
        muted:    '#6b7a6e',
        text:     '#e8ede9',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        sans: ['IBM Plex Sans', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
