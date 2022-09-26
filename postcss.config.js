const path = require('path')

module.exports = {
    plugins: {
        tailwindcss: {
            config: path.join(__dirname, 'tailwind.config.cjs') // update this if your path differs!
        },
        autoprefixer: {}
    }
}
