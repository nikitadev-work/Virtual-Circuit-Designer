/* eslint-disable @typescript-eslint/no-require-imports */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                'primary-foreground': 'var(--primary-foreground)',
                muted: 'var(--muted)',
                'muted-foreground': 'var(--muted-foreground)',
                'primary-background': 'var(--background)',
                'foreground': 'var(--foreground)',
                'card': 'var(--card)',
                'card-foreground': 'var(--card-foreground)',
                'popover': 'var(--popover)',
                'popover-foreground': 'var(--popover-foreground)',
                'secondary': 'var(--secondary)',
                'secondary-foreground': 'var(--secondary-foreground)',
                'accent': 'var(--accent)',
                'accent-foreground': 'var(--accent-foreground)',
                'destructive': 'var(--destructive)',
                'border': 'var(--border)',
                'input': 'var(--input)',
                'ring': 'var(--ring)',
                'sidebar': 'var(--sidebar)',
                'sidebar-foreground': 'var(--sidebar-foreground)',
                'sidebar-primary': 'var(--sidebar-primary)',
                'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
                'sidebar-accent': 'var(--sidebar-accent)',
                'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
                'sidebar-border': 'var(--sidebar-border)',
                'sidebar-ring': 'var(--sidebar-ring)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};