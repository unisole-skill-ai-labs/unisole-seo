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
        ring: 'hsl(var(--ring, 238 83% 60%))',
        background: 'hsl(var(--background, 0 0% 100%))',
        foreground: 'hsl(var(--foreground, 222 47% 11%))',
        primary: {
          DEFAULT: 'hsl(var(--primary, 238 83% 60%))',
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
          50: 'var(--brand-50, #eef2ff)',
          100: 'var(--brand-100, #e0e7ff)',
          200: 'var(--brand-200, #c7d2fe)',
          300: 'var(--brand-300, #a5b4fc)',
          400: 'var(--brand-400, #818cf8)',
          500: 'var(--brand-500, #6366f1)',
          600: 'var(--brand-600, #4f46e5)',
          700: 'var(--brand-700, #4338ca)',
          800: 'var(--brand-800, #3730a3)',
          900: 'var(--brand-900, #312e81)',
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

