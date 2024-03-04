/**
 * Generates all the Express routers for the application.
 */
// Import package modules.
import express from 'express';

// Import the types
import { ActiveSessions } from '../lib/types/ActiveSessions.js';
import { OAuthenticator } from './OAuthenticator.js';
import { ServerOptions } from '../lib/types/serverOptions.js';
import { GitlabApplicationSettings } from '../lib/types/GitlabApplicationSettings.js';

// Import the main router factory
import { createRouter } from '../routes/router.js';
// Import the subrouter factories
import createAuthRouter from '../routes/auth/authRouter.js';

export function createMainRouter(
  activeSessions: ActiveSessions,
  oAuthenticator: OAuthenticator,
  serverOptions: ServerOptions,
  gitlabApplicationSettings: GitlabApplicationSettings
): express.Router {
  const authRouter = createAuthRouter(activeSessions, oAuthenticator, serverOptions, gitlabApplicationSettings);
  const mainRouter = createRouter(authRouter, activeSessions, serverOptions, gitlabApplicationSettings);
  return mainRouter;
}