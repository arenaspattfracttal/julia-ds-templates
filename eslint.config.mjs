import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import react from "eslint-plugin-react"
import globals from "globals"

export default [
  { ignores: ["scripts/**"] },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // React 17+ new JSX transform — no need to import React in scope
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      // Pre-existing unused imports in shadcn/ui components — warn only
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-unused-vars": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Patterns valid in React 18+ that were not flagged by eslint-config-next
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      // Existing code has violations (max 29 in registry.tsx) — warn until refactored
      complexity: ["warn", 15],
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", ".next/**", "*.cjs"],
  },
]
