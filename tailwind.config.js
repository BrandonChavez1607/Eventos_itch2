const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { primary: c('primary'), accent: c('accent'), sport: c('sport'), ink: c('ink'), paper: c('paper'), card: c('card'), line: c('line') },
    fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'] },
  } },
};
