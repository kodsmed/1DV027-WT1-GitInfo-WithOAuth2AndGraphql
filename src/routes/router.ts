/**
 * @file router.ts - Defines the main router for the application
 * @module router
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'

import { authRouter } from './auth/authRouter.js'
import { Cookie } from 'express-session'
import ExtendedRequest from '../lib/types/req-extentions.js'

// import custom types
import SessionData from '../lib/types/sessionData-extentions.js'

/**
 * The main router for the application
 */
export const router = express.Router()

router.get('/', (req, res) => {
  const baseURL = "\\"
  res.render('home/index', {baseURL})
})

router.use('/auth', authRouter)

router.get('/cookie-set', (req, res) => {
  req.session.UUID = req.requestUuid;
  res.send('Cookie set');
})

router.get('/cookie-get', (req, res) => {
  // Replace 'cookieName' with the actual name of the cookie you want to retrieve
  if (req.session.UUID) {
    res.send('Welcome to your dashboard! \n' + req.session.UUID);
  } else {
    res.send('Please login to view your dashboard');
  }
})

router.use('*', (req, res, next) => {
  next(new Error('404 - Route not found'))
})