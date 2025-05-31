/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#10b981',
        danger: '#ef4444',
        'admin-bg': '#f3f4f6',
        'doctor-bg': '#f0fdfa',
        'patient-bg': '#f0f9ff',
      },
    },
  },
  plugins: [],
}
