import storybook from "eslint-plugin-storybook";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...storybook.configs["flat/recommended"],
  {
    ignores: ["scripts/**"],
  },
];

export default eslintConfig;
