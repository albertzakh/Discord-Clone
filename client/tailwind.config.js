/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'almost': 'calc(100vh - 53px)',
        'chat': 'calc(100vh - 130px)',
      }
    },
    screens: {
        "mobile": "640px",
        "ipad": "768px",
        'tablet': "1024px",
        "medium": "1280px",
        "laptop": "1024px",
        "desktop": "1280px",
    },
    colors: {
      "sidebar_bg": "#202225",
      "sidebar_logo": "#5865f2",
      "white": "white",
      "red": "red",
      "feed": "#313338",
      "gray": "#7e8185",
      "defaultText": "hsl(214, calc(var(--saturation-factor, 1) * 4%), 65.3%)",
      "lightGray": "#454950",
      "inviteBtn": "#3c438c",
      "black": "black"
    },
    boxShadow: {
      "menu": "0px 2px 13px -2px #36393F",
      "sidebar_popup": "1px 0px 11px 2px rgba(0,0,0,0.11);"
    },
    fontFamily: {
      "error": ["ABC Ginto Nord","Noto Sans","Helvetica Neue"],
    }
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
