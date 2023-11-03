/**
 * Vestly API
 * server.js
 *
 * The entry point for the Vestly API
 *
 */

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import database from './components/database';
import errorHandler from 'errorhandler';

/**
 * Initialize Server
 */

// Create Express server
export const app = express();

export function init() {
  // Express configuration
  app.set('port', process.env.PORT || 8080);
  app.use(express.json());
  app.use(cors());
  app.use(router);

  return app;
}

/**
 * Error handler
 */

/**
 * Error Handler. Provides full stack
 */

// if (process.env.NODE_ENV !== 'production') {
//   app.use(errorHandler());
// }

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.response) {
    const message = error.response.data?.Message || error.message;
    res.status(error.response.status).send({ message });
  }
  if (error.status) {
    res.status(error.status).send({ message: error.message || error });
  } else {
    res.status(402).send({ message: error.message });
  }
});

/**
 * Start Server
 */

export async function start() {
  database.init();
  const app = init();

  const server = app.listen(app.get('port'), () => {
    console.log(
      '  App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    );
    console.log('  Press CTRL-C to stop\n');
  });

  return server;
}

/**
 * Catch all unhandled errors
 */
process.on('unhandledRejection', (err) => {
  console.error(err);
  // Sentry.captureException(err, {
  //   level: 'fatal',
  // });
  process.exit(1);
});

export default { start };
