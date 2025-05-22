/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Modern dark theme colors
        darkBg: "#0a0a0a",
        darkInput: "#1a1a1a",
        darkBorder: "#262626",
        darkCard: "#141414",
        dark: {
          bg: "#0a0a0a",
          darker: "#050505",
          card: "#141414",
          elevated: "#1a1a1a",
          hover: "#252525",
        },
        // Modern light theme colors
        light: {
          bg: "#ffffff",
          darker: "#fafafa",
          card: "#ffffff",
          elevated: "#f8f9fa",
          hover: "#f3f4f6",
        },
        // Modern primary colors with vibrant gradients
        primary: {
          blue: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
          gray: "#6b7280",
          green: "#10b981",
          red: "#ef4444",
          orange: "#f97316",
          purple: "#8b5cf6",
          pink: "#ec4899",
        },
        // Refined text colors
        text: {
          white: "#ffffff",
          light: "#e5e7eb",
          muted: "#9ca3af",
          dark: "#111827",
          secondary: "#4b5563",
        },
        // Modern accent colors
        accent: {
          blue: "rgba(37, 99, 235, 0.1)",
          green: "rgba(16, 185, 129, 0.1)",
          red: "rgba(239, 68, 68, 0.1)",
          purple: "rgba(139, 92, 246, 0.1)",
        },
      },
      fontSize: {
        'xxs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        'light': 300,
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
        'extrabold': 800,
      },
      transitionDuration: {
        150: "150ms",
        250: "250ms",
        300: "300ms",
        400: "400ms",
      },
      borderRadius: {
        none: "0",
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
        '2xl': "1.25rem",
        '3xl': "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'md': '0 8px 12px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 12px 24px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 40px -8px rgba(0, 0, 0, 0.15)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow-sm': '0 0 15px rgba(37, 99, 235, 0.3)',
        'glow': '0 0 30px rgba(37, 99, 235, 0.4)',
        'glow-lg': '0 0 60px rgba(37, 99, 235, 0.5)',
        'soft': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 8px 40px 0 rgba(0, 0, 0, 0.08)',
        // Dark mode shadows
        'dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.4)',
        'dark-md': '0 8px 16px 0 rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 16px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      blur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
