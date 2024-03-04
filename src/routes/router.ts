/**
 * @file router.ts - Defines the main router for the application
 * @module router
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 * @version 1.0.0
 */
// Import packages
import express, { NextFunction } from 'express'

// Import the Modules
import { container, TYPES } from '../config/inversify.config.js'
import { UserController } from '../controller/UserController.js'
import { GitlabSessionController } from '../controller/GitlabSessionController.js'

// Import types
import { ExtendedRequest } from '../lib/types/req-extentions.js'
import { ActiveSessions } from '../lib/types/ActiveSessions.js'
import { GitlabApplicationSettings } from '../lib/types/GitlabApplicationSettings.js'
import { ServerOptions } from '../lib/types/serverOptions.js'

export function createRouter(
  authRouter: express.Router,
  activeSessions: ActiveSessions,
  serverOptions: ServerOptions,
  gitlabApplicationSettings: GitlabApplicationSettings
) {
  /**
   * The main router for the application.
   */
  const router = express.Router()
  const controller = container.get<UserController>(TYPES.UserController)
  const sessionController = container.get<GitlabSessionController>(TYPES.GitlabSessionController)

  /**
   * The home route for authenticated users... non-authenticated users will be redirected to the default route by the auth middleware.
   */
  router.route('/').get((req: ExtendedRequest, res: express.Response, next: express.NextFunction) => {
    const baseURL = serverOptions.baseURL
    controller.fetchAndRenderUserData(req, res, next, activeSessions, gitlabApplicationSettings.host, baseURL)
  })

  /**
   * The authentication routes deals with OAuth2.0 authentication providers.
   * @type {Router}
   * @NOTE Side effect: Sets session on successful authentication.
   */
  router.use('/auth', authRouter)

  /**
   * Pass everything else to the error handler.
   */
  router.use('*', (req, res, next) => {
    next(new Error('404 - Route not found'))
  })

  return router
}