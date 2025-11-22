

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#263c91",
                secondary: "#32915c",
                accent: "#51c186",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
