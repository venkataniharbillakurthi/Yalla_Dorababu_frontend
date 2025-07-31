/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b', // Deep blue
        accent: {
          DEFAULT: '#ff6a00', // Vibrant orange
          light: '#ff8c42',   // Lighter orange
          dark: '#d35400',    // Deep orange
        },
        background: '#FFF6F0', // Soft off-white
        surface: '#fff',
        navy: '#232946',
        yellow: '#ffd166',
        black: '#10141a',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Montserrat', 'Inter', 'DM Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Montserrat', 'Poppins', 'ui-sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        card: '0 4px 24px rgba(255,106,0,0.08)',
        orange: '0 6px 24px 0 rgba(255,106,0,0.16)',
        wow: '0 8px 32px 0 rgba(255,106,0,0.22)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'scroll-slow': 'scroll 40s linear infinite',
        'fade-in': 'fadeIn 1.2s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(.59,1.36,.59,1.36)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
