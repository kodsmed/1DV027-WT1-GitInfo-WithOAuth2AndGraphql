/**
 * Middleware to refresh the token if it's expired or about to expire.
 */

import express from 'express';
import { OAuthenticator } from '../services/OAuthenticator.js';
import { AuthDetails } from '../lib/types/AuthDetails.js';
import { ActiveSessions } from '../lib/types/ActiveSessions.js';
import { GitlabSessionController } from '../controller/GitlabSessionController.js'
import { container, TYPES } from '../config/inversify.config.js';
import { ExtendedRequest } from '../lib/types/req-extentions.js';

export const refreshCurrentTokenIfNeeded = (req: ExtendedRequest, res: express.Response, next: express.NextFunction, activeSessions: ActiveSessions, oAuthenticator: OAuthenticator) => {
  // Extract the current session from the activeSessions map, we know there is one because the user is authenticated in the previous middleware.
  const session = activeSessions.get(req.session.UUID)
  const authDetails = session as AuthDetails

  // Check if the session is about to expire... in 5 minutes.
  if (session && session.expiresAt - Date.now() < 1000 * 60 * 5) {
    // If the session is about to expire, refresh it.
    const controller = container.get(TYPES.GitlabSessionController) as GitlabSessionController
    controller.refreshSession(req.session.UUID, oAuthenticator, authDetails)
  }
  next()
}