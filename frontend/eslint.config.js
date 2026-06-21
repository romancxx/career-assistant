import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import importX from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      globals: globals.browser
    }
  },
  // Project source: stylistic + import hygiene. Scoped to src so root config
  // files (vite.config.ts, eslint.config.js) are not subject to these rules.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "@stylistic": stylistic,
      "import-x": importX
    },
    settings: {
      "import-x/resolver": {
        typescript: true
      }
    },
    rules: {
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      // Prettier handles indentation; avoid conflicts with @stylistic
      "@stylistic/indent": "off",
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/object-curly-spacing": ["error", "never"],
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/arrow-parens": ["error", "as-needed"],
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "@stylistic/comma-spacing": ["error", { before: false, after: true }],
      "@stylistic/key-spacing": [
        "error",
        { beforeColon: false, afterColon: true }
      ],
      "@stylistic/space-infix-ops": "error",
      "@stylistic/keyword-spacing": ["error", { before: true, after: true }],
      "@stylistic/space-before-blocks": "error",
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/jsx-closing-bracket-location": ["error", "line-aligned"],
      "@stylistic/jsx-first-prop-new-line": ["error", "multiline"],
      "@stylistic/jsx-max-props-per-line": [
        "error",
        { maximum: 1, when: "multiline" }
      ],
      "max-len": [
        "error",
        {
          code: 100,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
          ignoreStrings: true,
          ignorePattern: "^(import|export)\\s"
        }
      ],
      "@stylistic/jsx-wrap-multilines": [
        "error",
        {
          declaration: "parens-new-line",
          assignment: "parens-new-line",
          return: "parens-new-line",
          arrow: "parens-new-line",
          condition: "parens-new-line",
          logical: "parens-new-line"
        }
      ],

      // Import order rules
      "import-x/order": [
        "error",
        {
          distinctGroup: false,
          groups: [
            "builtin", // react
            "external", // all npm packages
            "type", // interfaces and other types
            "internal" // all @/... app code
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before"
            },
            {
              pattern: "react-dom/**",
              group: "builtin",
              position: "after"
            },
            {
              pattern: "@/interfaces/**",
              group: "type",
              position: "after"
            },
            {
              pattern: "@/features/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@/components/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@/lib/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@/hooks/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@/utils/**",
              group: "internal",
              position: "after"
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after"
            }
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          warnOnUnassignedImports: true,
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../*", "../../*", "../../../*", "./*"]
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: false,
          caughtErrors: "all"
        }
      ]
    }
  }
]);
