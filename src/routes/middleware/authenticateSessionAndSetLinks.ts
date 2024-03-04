/**
 * A Middleware function to check if the user has an active session and if not, redirect them to the front page.
 */
import express, { Request, Response, NextFunction } from 'express'
import { ExtendedRequest } from '../../lib/types/req-extentions.js'
import { ActiveSessions } from '../../lib/types/ActiveSessions.js'
import { container, TYPES } from '../../config/inversify.config.js'
import { UserController } from '../../controller/UserController.js'
import { navLinks } from '../../config/navLinks.js'

export const authenticateSessionAndSetLinks = (req: express.Request, res: express.Response, next: express.NextFunction, activeSessions: ActiveSessions, baseURL: string) => {
  // If the user is not logged in, redirect them to the home page.
  // Unless they are on the auth route, then we want to let them through.
  if ((!req.session?.UUID || !activeSessions.has(req.session.UUID)) && (!req.originalUrl.startsWith('/auth'))) {
    const controller = container.get<UserController>(TYPES.UserController)
    req.navLinks = navLinks.nonAuthenticatedLinks
    controller.displayHomePage(req, res, next, baseURL)
  } else {
  // ok, the user is logged in and have an active session to gitlab.
  req.navLinks = navLinks.authenticatedLinks
  next()
  }
}