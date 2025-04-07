module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                'xxs': '360px',  // Extra small screen breakpoint for very small mobile devices
                'xs': '480px',   // Small mobile devices
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite', // Slower spin animation
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
}