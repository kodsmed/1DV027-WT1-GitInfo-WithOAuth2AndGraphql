/**
 * @file router.ts - Defines the main router for the application
 * @module router
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'

import { authRouter } from './auth/authRouter.js'

/**
 * The main router for the application
 */
export const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello World!')
})

router.use('/auth', authRouter)

router.use('*', (req, res, next) => {
  next(new Error('404 - Route not found'))
})