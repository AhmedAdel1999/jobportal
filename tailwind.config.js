/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // screens: {
    //   "xs":"0px",
    //   'sm': '650px',
    //   'md': '990px',
    //   'lg': '1200px',
    //   'xl': '1380px',
    //   '2xl': '1536px',
    // },
    container: {
      center:true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily:{
        "mainFont":"Roboto, sans-serif"
      },
      colors:{
        "base-4":"#2C6975",
        "base-3":"#6BB2A0",
        "base-2":"#CDE0C9",
        "base-1":"#EDECDE",
        "input-bg":"#5aa7a7",
        "base-active":"#a4d8f5"
      },
      gridTemplateColumns:{
        '12': 'repeat(12, minmax(auto, 200px))',
      },
      transitionProperty:{
        "position":"position",
        "animation":"animation"
      },
      keyframes:{
        "loader":{
              "0%":{ 
                transform: "scale(1,0.4)"
            }, 
            "20%": { 
              transform: "scale(1,0.1)"
          },
            "40%":{ 
              transform: "scale(1,0.4)"
            }, 
            "100%" :{ 
              transform: "scale(1,0.4)"
            }, 
        }
      },
      animation:{
        "loader":"loader 1.2s infinite ease-out"
      }
    },
  },
  plugins: [
    
  ],
}

