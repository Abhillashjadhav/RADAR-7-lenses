/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        radar: {
          bg: '#0F1117',
          card: '#1A1D2E',
          navy: '#1E3A5F',
          critical: '#DC2626',
          elevated: '#D97706',
          monitor: '#16A34A',
          border: '#2A2D3E',
          text: '#E2E8F0',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}
