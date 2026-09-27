import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

        theme: {
            extend: {
            colors: {
                ink: "#1B1B1B",
                paper: "#FBFBF9",
                "paper-dim": "#F2F2EE",
                marigold: "#6E7F5C",
                "marigold-dark": "#57654A",
                teal: "#4F6B63",
                sun: "#C9B37E",
                line: "#E3E1DB",
                "text-soft": "#767470",
            },
            fontFamily: {
                display: ['"Inter"', "sans-serif"],
                body: ["Manrope", "sans-serif"],
                mono: ['"Space Grotesk"', "monospace"],
            },
            boxShadow: {
                hard: "0 10px 30px -10px rgba(27,27,27,0.16)",
                "hard-lg": "0 20px 45px -15px rgba(27,27,27,0.22)",
                "hard-sm": "0 6px 20px -8px rgba(27,27,27,0.12)",
                "hard-marigold": "0 6px 20px -8px rgba(110,127,92,0.35)",
            },
        },
    },

    plugins: [forms],
};
