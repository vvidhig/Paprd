/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: '#E8C0FC',
        skyblue: '#A8DEFA',
        mint: '#D0F4E0',
        cream: '#FCF5BF',
        rose: '#FF99C8',
        dark: '#2D2640',
        page: '#FAFAFE',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(232,192,252,0.15)',
        'card-hover': '0 8px 30px rgba(232,192,252,0.25)',
        focus: '0 0 0 3px rgba(168,222,250,0.4)',
        cta: '0 4px 15px rgba(255,153,200,0.3)',
        panel: '0 8px 40px rgba(232,192,252,0.35)',
      },
      borderRadius: {
        card: '20px',
        pill: '50px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        overshoot: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseBorder: {
          '0%, 100%': { borderColor: 'rgba(232,192,252,0.6)' },
          '50%': { borderColor: 'rgba(232,192,252,1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
        pulseBorder: 'pulseBorder 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
