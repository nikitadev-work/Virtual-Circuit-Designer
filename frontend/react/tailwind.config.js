module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,css}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                'primary-foreground': 'var(--primary-foreground)',
                muted: 'var(--muted)',
                'muted-foreground': 'var(--muted-foreground)',
            },
        },
    },
    plugins: [],
}