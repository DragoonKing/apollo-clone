import { createServer } from 'vite';

const server = await createServer({
  // any valid user config options, plus `mode` and `configFile`
  configFile: './vite.config.ts',
  root: '.',
  server: {
    port: 5173
  }
});

await server.listen();

server.printUrls();