module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
<<<<<<< HEAD
        extend: {
            screens: {
                'xxs': '360px',  // Extra small screen breakpoint for very small mobile devices
                'xs': '480px',   // Small mobile devices
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite', // Slower spin animation
            },
        },
=======
        extend: {},
>>>>>>> 6225a9a9616beac8c91fb8f81f1d3cf32647f935
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}