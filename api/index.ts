// @ts-ignore
import server from '../dist/server.cjs';

// Ensure we get the correct Express app instance regardless of ESM/CJS wrapper differences
const app = (server as any).default || server;

export default app;

