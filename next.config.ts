import { type NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY!,
  },
};

export default config;
