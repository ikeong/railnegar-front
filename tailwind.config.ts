export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],      // Default body font
        heading: ['Pinar', 'sans-serif'],        // For titles/headings
        body: ['Vazirmatn', 'sans-serif'],       // Explicit body font
      },
      colors: {
        // Bootstrap-style gray — exactly as it was before
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        'gray-dark': '#343a40',

        // Bootstrap colors restored — each with a full shade scale so shaded
        // utilities (bg-blue-50, text-purple-700, …) generate CSS. The 500/600
        // shades carry the original bootstrap hex values.
        blue: {
          50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9',
          400: '#22d3ee', 500: '#17a2b8', 600: '#138496', 700: '#0e7490',
          800: '#155e75', 900: '#164e63',
        },
        indigo: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
          400: '#818cf8', 500: '#6610f2', 600: '#4f46e5', 700: '#4338ca',
          800: '#3730a3', 900: '#312e81',
        },
        purple: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#6f42c1', 600: '#59359a', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95',
        },
        pink: {
          50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4',
          400: '#f472b6', 500: '#e83e8c', 600: '#db2777', 700: '#be185d',
          800: '#9d174d', 900: '#831843',
        },
        red: {
          50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5',
          400: '#f87171', 500: '#dc3545', 600: '#c82333', 700: '#b91c1c',
          800: '#991b1b', 900: '#7f1d1d',
        },
        orange: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#fd7e14', 600: '#ea580c', 700: '#c2410c',
          800: '#9a3412', 900: '#7c2d12',
        },
        yellow: {
          50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047',
          400: '#facc15', 500: '#ffc107', 600: '#e0a800', 700: '#a16207',
          800: '#854d0e', 900: '#713f12',
        },
        green: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
          400: '#4ade80', 500: '#28a745', 600: '#1e7e34', 700: '#15803d',
          800: '#166534', 900: '#14532d',
        },
        teal: {
          50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#20c997', 600: '#1ba87f', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a',
        },
        cyan: {
          50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9',
          400: '#22d3ee', 500: '#17a2b8', 600: '#0891b2', 700: '#0e7490',
          800: '#155e75', 900: '#164e63',
        },

        // Brand color — same teal as before; DEFAULT keeps bg-primary/text-primary working
        primary: {
          DEFAULT: '#20c997',
          50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4',
          400: '#2dd4bf', 500: '#20c997', 600: '#1ba87f', 700: '#0f766e',
          800: '#115e59', 900: '#134e4a',
        },
        secondary: '#6c757d',
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
        danger: '#dc3545',
        light: '#f8f9fa',
        dark: '#343a40',
      }
    }
  }
}
