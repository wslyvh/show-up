import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {},
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ['night'],
  },
}
export default config
