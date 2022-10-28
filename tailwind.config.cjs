const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                neutral: colors.slate,
                primary: colors.purple,
                secondary: colors.orange,
                accent: colors.fuchsia
            },
            screens: {
                xs: '420px'
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        'blockquote p:first-of-type::before': {
                            content: 'none'
                        },
                        'blockquote p:first-of-type::after': {
                            content: 'none'
                        },
                        'code::before': { content: 'none' },
                        'code::after': { content: 'none' },
                        code: {
                            fontWeight: theme('fontWeight.normal'),
                            backgroundColor: theme('colors.violet.100'),
                            paddingBlock: theme('spacing')[1],
                            paddingInline: theme('spacing')[1.5],
                            borderRadius: theme('borderRadius.DEFAULT')
                        }
                    }
                }
            })
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/forms'),

        plugin(function childrenPlugin({ addVariant }) {
            // apply a style to all direct children
            // example usage: "children:border-l children:border-blue-500"
            addVariant('children', '& > *')
        })
    ]
}
