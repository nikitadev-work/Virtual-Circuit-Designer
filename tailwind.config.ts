/** @type {import('tailwindcss').Config} */
import animate from "tailwindcss-animate"

module.exports = {
    content: [
        "./app/**/*.{ts,tsx,js,jsx}",
        "./pages/**/*.{ts,tsx,js,jsx}",
        "./components/**/*.{ts,tsx,js,jsx}",
        "./src/**/*.{ts,tsx,js,jsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [animate],
}
