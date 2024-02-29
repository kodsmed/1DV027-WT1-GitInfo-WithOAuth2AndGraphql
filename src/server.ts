/**
 * @file This file is the main entry point for the application.
 * @description sets up the IoC container, sets up and starts the Express Server.
 * @module server
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */

// WARNING: Package author recommend this to be first to avoid issues with async.
// WARNING: This package does not go well with express-jwt.
import httpContext from 'express-http-context';

// Node built-in modules.
import { randomUUID } from 'node:crypto'
import http, { Server } from 'node:http'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

// Package modules.
import helmet from 'helmet';
import cors from 'cors';
import express, { NextFunction, Request, Response, response } from 'express';
import session from 'express-session';
import 'dotenv/config'
import { morganLogger } from './config/morgan.js';

// Application modules.
import { limiter } from './config/rateLimiter.js'
import { logger } from './config/winston.js'
import { createMainRouter } from './service/routerFactory.js';
import { OAuthenticator } from './service/OAuthenticator.js';

// Load configuration settings.
import { sessionOptions } from './config/sessionOptions.js';
import { serverOptions } from './config/serverOptions.js';
import { bootstrapViewEngine } from './config/bootstrapViewEngine.js';

// Load extended types.
import ExtendedRequest from './lib/types/req-extentions.js';
import { ExtendedError } from './lib/types/ExtendedError.js';
import { AuthDetails } from './lib/types/AuthDetails.js';
import { ActiveSessions } from './lib/types/ActiveSessions.js';
import { gitlabApplicationSettings } from './config/gitlabApplicationSettings.js';

// Set up
try {
  const app = express();

  // Tie a map of active sessions paired with gitlab credentials to the application.
  // TODO: SINGLETON: This should be a singleton in the IoC container.
  const activeSessions = new Map<string, AuthDetails>() as ActiveSessions;
  app.set('activeSessions', activeSessions);

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  // app.use(helmet())

  // Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
  // app.use(cors())

  // Parse requests of the content type application/json.
  app.use(express.json())

  // Add the request-scoped context.
  // NOTE! Must be placed before any middle that needs access to the context!
  //       See https://www.npmjs.com/package/express-http-context.
  app.use(httpContext.middleware)

  // Use a morgan logger.
  app.use(morganLogger)

  // Apply the rate limiting middleware to all requests.
  app.use(limiter)

  // Set up session handling.
  app.use(session(sessionOptions))
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy if on the production environment.
  }

  app.use((req, res, next) => {
    console.log('Cookies:', req.cookies); // If you are using 'cookie-parser' middleware
    console.log('Session:', req.session);
    next();
  });

  // Middleware to be executed before the routes.
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Check if there is a session cookie and if there is re-acquire the UUID from the session.
    // WARNING: Removing the optional chaining operator ?. will cause the server to crash if the session is not found.
    if (req.session?.UUID) {
      console.log('fsadfa')
      console.log('Session found', req.session)
      console.log('Session UUID', req.session.UUID)
      console.log('req.requestUuid', req.requestUuid)
      req.requestUuid = req.session.UUID
      console.log('req.requestUuid after session', req.requestUuid)
    } else {
      // Add a new request UUID to each request
      console.log('No session found')
      req.requestUuid = randomUUID()
    }

    next()
  })

  // Set up the view engine.
  bootstrapViewEngine(app, response, serverOptions)

  // Serve static files.
  app.use(express.static(serverOptions.publicPath))


  // Register routes.
  const mainRouter = createMainRouter(activeSessions, new OAuthenticator(gitlabApplicationSettings), serverOptions, gitlabApplicationSettings)
  app.use('/', mainRouter)

  // Error handler.
  app.use((err: ExtendedError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message, { error: err })

    if (process.env.NODE_ENV === 'production') {
      // Ensure a valid status code is set for the error.
      // If the status code is not provided, default to 500 (Internal Server Error).
      // This prevents leakage of sensitive error details to the client.
      if (!err.status) {
        err.status = 500
        err.message = http.STATUS_CODES[err.status] || 'Internal Server Error'
      }

      // Send only the error message and status code to prevent leakage of
      // sensitive information.
      res
        .status(err.status)
        .json({
          error: err.message
        })

      return
    }

    // ---------------------------------------------------
    // ⚠️ WARNING: Development Environment Only!
    //             Detailed error information is provided.
    // ---------------------------------------------------

    // Deep copies the error object and returns a new object with
    // enumerable and non-enumerable properties (cyclical structures are handled).
    const copy = JSON.decycle(err, { includeNonEnumerableProperties: true })

    return res
      .status(err.status || 500)
      .json(copy)
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(serverOptions.port, () => {
    logger.info(`Server running at http://localhost:${serverOptions.port}`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (err) {
  const errorString = err instanceof Error ? err.message : 'An unknown error occurred'
  logger.error(errorString, { error: err })
  process.exitCode = 1
}
