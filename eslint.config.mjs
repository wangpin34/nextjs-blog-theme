import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';

const config = [...nextCoreWebVitals, eslintConfigPrettier];

export default config;
