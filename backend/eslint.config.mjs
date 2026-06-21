// @ts-check
import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import importX from "eslint-plugin-import-x";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["eslint.config.mjs", "dist"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },
  // Project source & tests: stylistic + import hygiene.
  {
    files: ["{src,test,scripts}/**/*.ts"],
    plugins: {
      "@stylistic": stylistic,
      "import-x": importX,
    },
    settings: {
      "import-x/resolver": {
        typescript: true,
      },
    },
    rules: {
      "@stylistic/semi": ["error", "always"],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      // Prettier handles indentation; avoid conflicts with @stylistic.
      "@stylistic/indent": "off",
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/array-bracket-spacing": ["error", "never"],
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/eol-last": ["error", "always"],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "@stylistic/comma-spacing": ["error", { before: false, after: true }],
      "@stylistic/key-spacing": ["error", { beforeColon: false, afterColon: true }],
      "@stylistic/space-infix-ops": "error",
      "@stylistic/keyword-spacing": ["error", { before: true, after: true }],
      "@stylistic/space-before-blocks": "error",
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "max-len": [
        "error",
        {
          code: 100,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignorePattern: "^(import|export)\\s",
        },
      ],
      // Import order rules
      "import-x/order": [
        "error",
        {
          distinctGroup: false,
          groups: [
            "builtin", // node builtins
            "external", // all npm packages
            "type", // interfaces and other types
            "internal", // all @/... app code
          ],
          pathGroups: [
            {
              pattern: "@nestjs/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**/interfaces",
              group: "type",
              position: "after",
            },
            {
              pattern: "@/**/dto",
              group: "type",
              position: "after",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          warnOnUnassignedImports: true,
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: ["../*", "../../*", "../../../*", "./*"],
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: false,
          caughtErrors: "all",
        },
      ],
    },
  },
);
