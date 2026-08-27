import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'rgb(226, 232, 240)', // Fallback slate
        input: 'hsl(var(--input, 214 32% 91%))',
        ring: 'hsl(var(--ring, 215 25% 27%))',
        background: 'hsl(var(--background, 0 0% 100%))',
        foreground: 'hsl(var(--foreground, 222 47% 11%))',
        primary: {
          DEFAULT: 'hsl(var(--primary, 222.2 47.4% 11.2%))',
          foreground: 'hsl(var(--primary-foreground, 210 40% 98%))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary, 210 40% 96%))',
          foreground: 'hsl(var(--secondary-foreground, 222 47% 11%))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive, 0 84% 60%))',
          foreground: 'hsl(var(--destructive-foreground, 210 40% 98%))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted, 215 16% 47%))',
          foreground: 'hsl(var(--muted-foreground, 215 20% 65%))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent, 210 40% 96%))',
          foreground: 'hsl(var(--accent-foreground, 222 47% 11%))',
        },
        card: {
          DEFAULT: 'hsl(var(--card, 0 0% 100%))',
          foreground: 'hsl(var(--card-foreground, 222 47% 11%))',
        },
        brand: {
          50: 'var(--brand-50, #f8fafc)',
          100: 'var(--brand-100, #f1f5f9)',
          200: 'var(--brand-200, #e2e8f0)',
          300: 'var(--brand-300, #cbd5e1)',
          400: 'var(--brand-400, #94a3b8)',
          500: 'var(--brand-500, #64748b)',
          600: 'var(--brand-600, #475569)',
          700: 'var(--brand-700, #334155)',
          800: 'var(--brand-800, #1e293b)',
          900: 'var(--brand-900, #0f172a)',
        },
        indigo: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          750: '#1e293b',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        violet: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          750: '#1e293b',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      borderRadius: {
        lg: 'var(--radius-card, 1.25rem)',
        md: 'var(--radius, 0.75rem)',
        sm: 'calc(var(--radius, 0.75rem) - 4px)',
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

