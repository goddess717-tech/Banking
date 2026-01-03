// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter','ui-sans-serif','system-ui','-apple-system',
          'Segoe UI','Roboto','Arial','Noto Sans','sans-serif'
        ]
      },
      colors: {
        navy: { 900:'#0B1220', 800:'#121B2B', 700:'#17233A', 600:'#1D2C49', 500:'#243456' },
        emerald: { 500:'#10B981', 600:'#059669', 700:'#047857' },
        deepblue: { 500:'#2563EB', 600:'#1D4ED8', 700:'#1E40AF' },
        ink: { 900:'#0F172A', 800:'#111827', 700:'#1F2937' }
      },
      boxShadow: {
        card: '0 12px 36px rgba(0,0,0,.10)',
        glass: '0 20px 60px rgba(0,0,0,.25)'
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.stop-dark-0': { 'stop-color': '#0F1A2E' },
        '.stop-dark-1': { 'stop-color': '#1C2B4D' },
        '.stop-light-0': { 'stop-color': '#465373' },
        '.stop-light-1': { 'stop-color': '#828CA1' },
      }, ['responsive', 'dark']);
    }
  ]
};
