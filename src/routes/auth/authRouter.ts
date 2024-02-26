/**
 * @file authRouter.ts - Defines the routs for all authentication related endpoints
 * @module authRouter
 * @version 0.0.1
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */

import express from 'express'

import { OAuthenticator } from './OAuthenticator.js'

export const authRouter = express.Router()

const port = process.env.EXPRESS_PORT || ""
const clientId = process.env.GITLAB_CLIENT_ID || ""
const clientSecret = process.env.GITLAB_CLIENT_SECRET || ""
const host = process.env.GITLAB_HOST_URL || ""
const redirectURLBase = `http://localhost:${port}/auth/`;
const scopes = ['read_user', 'read_api']

authRouter.get('/gitlab', (req, res, next) => {
// Redirect the user to the OAuth2.0 provider
const completeRedirectURL = redirectURLBase + 'gitlab-callback/';
const authURL = `${host}/oauth/authorize?client_id=${clientId}&redirect_uri=${completeRedirectURL}&response_type=code&scope=${scopes.join('%20')}`;
res.redirect(authURL);
})

authRouter.get('/otherProvider', (req, res, next) => {
  // Redirect the user to the OAuth2.0 provider
  const completeRedirectURL = redirectURLBase + 'other_provider-callback';
  const authURL = `${host}/oauth/authorize?client_id=${clientId}&redirect_uri=${completeRedirectURL}&response_type=code&scope=${scopes.join('%20')}`;
  res.redirect(authURL);
  })

authRouter.get('/gitlab-callback/', async (req, res, next) => {
  // Finish the authentication process and get the tokens, then redirect the user to the home page.
  // Starting by deconstructing the code from the query string
  const { code } = req.query
  if (!code) {
    next(new Error('No code provided'))
    return
  }

  // Create a new OAuthenticator instance
  try {
    const completeRedirectURL = redirectURLBase + 'gitlab-callback/';
    const authenticator = new OAuthenticator(clientId, clientSecret, host)
    const authDetails = await authenticator.authenticate(code as string, completeRedirectURL)
    // TODO: Save the tokens and pass them to the user as a session cookie
    // TODO: Remove the console.log and send a proper response
    console.log('Authentication successful', authDetails)
    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error exchanging code for token', error);
    res.status(500).send('Authentication failed');
  }
})