/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          25:  '#F5F8FF',
          50:  '#E8F1FB',
          100: '#DCE9FF',
          600: '#1E6DFF',
          700: '#155EEA',
          DEFAULT: '#007BFF',
        },
      },
      boxShadow: { card: '0 4px 12px rgba(0,0,0,0.06)' },
      borderRadius: { xl: '12px', '2xl': '16px' },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
    },
  },
  plugins: [],
}
