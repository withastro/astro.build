/** @type {import('prettier').Config} */
module.exports = {
    trailingComma: 'none',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    plugins: [require.resolve('prettier-plugin-astro')],
    overrides: [{ files: '*.astro', options: { parser: 'astro' } }]
}
