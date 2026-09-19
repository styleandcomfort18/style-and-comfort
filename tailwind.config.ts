import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ported directly from the original design file
        brand: {
          bg: "#F6FAF6",        // page background
          light: "#EEF7EE",     // soft green panels
          border: "#D8E6DC",    // hairline borders
          primary: "#1B7A43",   // main green (buttons, links)
          dark: "#134D2C",      // deep green (headers, footer)
          darker: "#0B3D24",
          accent: "#B23A2A",    // sale / alert accent (terracotta-red)
          white: "#FFFFFF",
          text: "#182620",      // near-black text with a green tint
          whatsapp: "#25D366",
          lime: "#8DC63F",
        },
      },
      fontFamily: {
        display: ["Poppins", "Segoe UI", "Arial", "sans-serif"],
        body: ["Inter", "Segoe UI", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
