import formatjs from "eslint-plugin-formatjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("next/core-web-vitals"),
    {
        plugins: {
            "@formatjs": formatjs,
        },

        rules: {
            "@formatjs/enforce-id": ["error", {
                idInterpolationPattern: "[sha512:contenthash:base64:6]",
                idWhitelist: [],
            }],
        },
    },
];