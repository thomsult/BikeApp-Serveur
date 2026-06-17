import { defineConfig } from '@hey-api/openapi-ts';
import dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV ?? 'local'}`,
});

export default defineConfig({
  input: `${process.env.VITE_PUBLIC_BASE_URL}/docs/api.json`,
  output: 'src/client',
  plugins: [
    '@tanstack/react-query',
    'zod',
    {
      name: "@hey-api/client-axios",
      runtimeConfigPath: '@/lib/api/common/client',
    },
  ]
});