import express from 'express';
import bodyParser from 'body-parser';
import { Socket } from 'net';
import { Server } from 'http';
import { requestLogger } from './middlewares/request-logger';
import productsRouter from './routes/products.routes';
import { connect } from './env/mongodb-connection';

export const app = express();

app.use(bodyParser.json());
app.use(requestLogger);
app.use('/api/products', productsRouter);

// [Module 10] Graceful shutdown - closes active connections and the server
export const shutdown = (server: Server, connections: Socket[], signal: string) => {};

const PORT = 8000;

/**
 * Initializes and starts the HTTP server, and sets up handling for system signals
 * for graceful shutdown.
 * @returns {Server} The HTTP server instance.
 */
export const bootstrap = async () => {
  await connect();

  const server = app.listen(PORT, () => {
    console.log(`Server is started on port ${PORT}`);
  });

  // [Module 10] Connection tracking and termination signal handling
  // const connections: Socket[] = [];
  // process.on('SIGTERM', () => shutdown(server, connections, 'SIGTERM'));
  // process.on('SIGINT', () => shutdown(server, connections, 'SIGINT'));

  return server;
};
