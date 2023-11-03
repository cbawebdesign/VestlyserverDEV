import server from './src/server';

/**
 * Initialize and Start the server
 */

server.start().catch((err) => {
  console.error('index.ts', err);
  // Sentry.captureException(err, {
  //   level: 'fatal',
  // });
  process.exit(1);
});
