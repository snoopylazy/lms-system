/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", // main blue (500)
          dark: "#1D4ED8", // darker blue (600)
          light: "#93C5FD", // soft light blue (300)
          hover: "#60A5FA", // hover (400)
          text: "#1E3A8A", // deep navy for contrast
          border: "#60A5FA", // border blue
          bg: "#EFF6FF", // very soft blue background (50)
          focus: "#2563EB", // strong focus blue (500/600)
          active: "#1E40AF", // pressed/active state
          disabled: "#DBEAFE", // muted very light blue
          30: "rgba(59, 130, 246, 0.2)", // blue with 20% opacity
        },
        // primary: {
        //   DEFAULT: "#10B981", // main green
        //   dark: "#047857", // darker green
        //   light: "#6EE7B7", // pale green
        //   hover: "#6EE7B7", // hover highlight
        //   text: "#064E3B", // dark green text for contrast
        //   border: "#34D399", // green border
        //   bg: "#ECFDF5", // soft green background
        //   focus: "#059669", // strong focus green
        //   active: "#065F46", // pressed dark green
        //   disabled: "#D1FAE5", // light muted green
        // },
      },
    },

    fontFamily: {
      khmer: ["Noto", "serif"],
    },

    keyframes: {
      "fade-up": {
        "0%": {
          opacity: "0",
          transform: "translateY(40px) scale(0.95)", // slightly bigger movement + scale
        },
        "60%": {
          opacity: "0.6",
          transform: "translateY(10px) scale(1.02)", // small overshoot for a smooth pop
        },
        "100%": {
          opacity: "1",
          transform: "translateY(0) scale(1)",
        },
      },
    },
    animation: {
      "fade-up": "fade-up 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards",
    },
  },
  // gold
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-gold": {
          "scrollbar-width": "thin",
          "scrollbar-color": "#FBBF24 #FFFBEB", // thumb / track
          "scroll-behavior": "smooth", // ✅ smooth scrolling
        },
        ".scrollbar-gold::-webkit-scrollbar": {
          width: "8px",
        },
        ".scrollbar-gold::-webkit-scrollbar-track": {
          background: "#FFFBEB",
          borderRadius: "8px",
        },
        ".scrollbar-gold::-webkit-scrollbar-thumb": {
          backgroundColor: "#FBBF24",
          borderRadius: "8px",
        },
        ".scrollbar-gold::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#F59E0B",
        },

        /* Auto apply to common PrimeVue scrollables */
        ".p-datatable.scrollbar-gold, .p-dialog.scrollbar-gold, .p-scrollpanel-wrapper.scrollbar-gold, .p-dropdown-panel.scrollbar-gold":
          {
            "scrollbar-width": "thin",
            "scrollbar-color": "#FBBF24 #FFFBEB",
            "scroll-behavior": "smooth",
          },
      });
    },
  ],
};
