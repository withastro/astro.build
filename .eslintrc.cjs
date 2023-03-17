/** @type {import('eslint').Linter.Config} */
module.exports = {
  ...require("@astrojs/site-kit/eslint"),
  plugins: ["tailwindcss"],
  extends: ["plugin:tailwindcss/recommended"],
  rules: {
    "tailwindcss/migration-from-tailwind-2": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/classnames-order": "off",
  },
  settings: {
    tailwindcss: {
      config: "./tailwind.config.cjs",
    },
  },
  ignorePatterns: ["**/.astro/**"],
}
