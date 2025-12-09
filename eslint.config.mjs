// eslint.config.mjs

import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "node_modules",
      ".next",
      "dist",
      "vynce-backend",
      "vynce-social-frontend-code",
      "tailwind.config.ts",
    ],
  },

  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      ...tsPlugin.configs.recommended.rules,

      // Make linting quieter & developer-friendly
      "no-console": "off",

      // Allow any
      "@typescript-eslint/no-explicit-any": "off",

      // Auto-ignore unused variables starting with "_"
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  prettier,
];
