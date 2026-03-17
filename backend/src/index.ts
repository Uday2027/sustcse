import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const PORT = parseInt(env.PORT);

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────

let isShuttingDown = false;

const shutdown = (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal}. Shutting down gracefully...`);

  server.close((err) => {
    if (err) {
      logger.error('Error during server close:', err);
      process.exit(1);
    }
    logger.info('HTTP server closed. Process exiting.');
    process.exit(0);
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing exit.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception — server will shut down:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection — server will shut down:', { reason });
  shutdown('unhandledRejection');
});
