import rootConfig from "../../eslint.config.mjs";
import nextVitals from "eslint-config-next/core-web-vitals";

const config = [...rootConfig, ...nextVitals];

export default config;
