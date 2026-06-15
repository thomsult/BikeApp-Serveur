import { defineConfig } from '@hey-api/openapi-ts';
import { handler } from './src/client/safe-union-transformer';
import dotenv from 'dotenv';
dotenv.config({
  path: `.env.${process.env.NODE_ENV ?? 'local'}`,
});

export default defineConfig({
  input: `${process.env.VITE_PUBLIC_BASE_URL}/docs/api.json`,
  output: 'src/client',
  plugins: [{
    name: '@hey-api/client-axios',
    runtimeConfigPath: 'src/lib/api/common/client.tsx',
  },

  ],
});