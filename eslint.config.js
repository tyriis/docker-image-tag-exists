import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        es2021: true,
        node: true,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        process: true,
        console: true,
      },
    },
    rules: {
      "comma-dangle": ["error", "always-multiline"],
      semi: ["error", "never"],
    },
  },
]
