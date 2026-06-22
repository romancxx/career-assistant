import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";
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
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "import-x": importX
    },
    settings: {
      "import-x/resolver": {
        typescript: true
      }
    },
    rules: {
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
  },
  eslintConfigPrettier
]);
