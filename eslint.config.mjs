import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([{
  files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  plugins: {
    js,
  },
  extends: ["js/recommended"],
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
  rules: {
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
    "prefer-const": "error",
    "no-debugger": "error",
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "react/jsx-no-useless-fragment": "warn",
    "react/self-closing-comp": "warn"
  },
},
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  "prettier"
]);
