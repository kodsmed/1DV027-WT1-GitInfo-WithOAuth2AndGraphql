/**
 * @file router.ts - Defines the main router for the application
 * @module router
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'

export function createRouter(authRouter: express.Router) {
  /**
   * The main router for the application.
   */
  const router = express.Router()

  /**
   * The home route.
   */
  router.get('/', (req, res) => {
    const baseURL = "\\"
    res.render('home/index', { baseURL })
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