/**
 * @file authRouter.ts - Defines the routs for all authentication related endpoints
 * @module authRouter
 * @version 0.0.1
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */

import express, { request, response, NextFunction } from 'express'
import { OAuthenticator } from '../../services/OAuthenticator.js'
import { ActiveSessions } from '../../lib/types/ActiveSessions.js'
import { ServerOptions } from '../../lib/types/serverOptions.js'
import { GitlabApplicationSettings } from '../../lib/types/GitlabApplicationSettings.js'

// Import the AuthDetails type
import { AuthDetails } from '../../lib/types/AuthDetails.js'
import { container, TYPES } from '../../config/inversify.config.js'
import { GitlabSessionController } from '../../controller/GitlabSessionController.js'
import { ExtendedRequest } from '../../lib/types/req-extentions.js';

export default function createAuthRouter(
  activeSessions: ActiveSessions,
  oAuthenticator: OAuthenticator,
  serverOptions: ServerOptions,
  gitlabApplicationSettings: GitlabApplicationSettings
): express.Router {
  const authRouter = express.Router()

  // The base URL for the redirect URL, by splitting it like this we can easily add the callback path later.
  // Thus allowing us to use the same base URL for additional OAuth2.0 providers, if we want to add more in the future.
  const port = serverOptions.port
  const host = gitlabApplicationSettings.host
  const redirectURLBase = `http://localhost:${port}/auth/`;
  const scopes = ['read_user', 'read_api']


  authRouter.get('/gitlab', (req, res, next) => {
    // Redirect the user to the gitlab OAuth2.0 provider
    // This is not really needed, It could just be a link in the front end, but, as mentioned I prepared for multiple providers.
    // consequently, It does not have its own method in the controller either.
    const completeRedirectURL = redirectURLBase + 'gitlab-callback';
    const authURL = `${host}/oauth/authorize?client_id=${gitlabApplicationSettings.applicationID}&redirect_uri=${completeRedirectURL}&response_type=code&scope=${scopes.join('%20')}`;
    res.redirect(authURL);
  })

  // get gitlab-callback
  authRouter.route('/gitlab-callback?').get(async (req: ExtendedRequest, res: express.Response, next: NextFunction) => {
    const controller = container.get(TYPES.GitlabSessionController) as GitlabSessionController
    await controller.login(
      req, res, next,
      oAuthenticator,
      activeSessions,
      redirectURLBase
    )
  })

  authRouter.route('/logout').get((req, res, next) => {
    // pass to controller to delete the session
    const controller = container.get(TYPES.GitlabSessionController) as GitlabSessionController
    controller.deleteSession(req, res, next)
  })

  return authRouter
}
