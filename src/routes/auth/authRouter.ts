/**
 * @file authRouter.ts - Defines the routs for all authentication related endpoints
 * @module authRouter
 * @version 0.0.1
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */

import express from 'express'

import { OAuthenticator } from './OAuthenticator.js'

export const authRouter = express.Router()
const app = express()

const port = process.env.EXPRESS_PORT || ""
const clientId = process.env.GITLAB_CLIENT_ID || ""
const clientSecret = process.env.GITLAB_CLIENT_SECRET || ""
const host = process.env.GITLAB_HOST_URL || ""

// The base URL for the redirect URL, by splitting it like this we can easily add the callback path later.
// Thus allowing us to use the same base URL for additional OAuth2.0 providers, if we want to add more in the future.
const redirectURLBase = `http://localhost:${port}/auth/`;
const scopes = ['read_user', 'read_api']


authRouter.get('/gitlab', (req, res, next) => {
// Redirect the user to the OAuth2.0 provider
const completeRedirectURL = redirectURLBase + 'gitlab-callback';
const authURL = `${host}/oauth/authorize?client_id=${clientId}&redirect_uri=${completeRedirectURL}&response_type=code&scope=${scopes.join('%20')}`;
res.redirect(authURL);
})

// get gitlab-callback
authRouter.get('/gitlab-callback?', async (req, res, next) => {
  // Finish the authentication process and get the tokens, then redirect the user to the home page.
  // Starting by deconstructing the code from the query string
  const { code } = req.query
  if (!code) {
    next(new Error('No code provided'))
    return
  }

  // Create a new OAuthenticator instance
  try {
    const completeRedirectURL = redirectURLBase + 'gitlab-callback';
    const authenticator = new OAuthenticator(clientId, clientSecret, host)
    const authDetails = await authenticator.authenticate(code as string, completeRedirectURL)
    console.log('Authentication successful', authDetails)

    // Ok, logged in... create a session and then use the activeSessions map to store the session paired with the gitlab credentials.
    req.session.UUID = req.requestUuid;
    app.get('activeSessions').set(req.session.UUID, authDetails)

    // Redirect the user
    res.redirect('./final')
  } catch (error) {
    console.error('Error exchanging code for token', error);
    res.status(500).send('Authentication failed');
  }
})

authRouter.get('/final', async (req, res, next) => {
  const accessToken = app.get('activeSessions').get(req.session.UUID)?.accessToken
  if (!accessToken) {
    next(new Error('No access token found'))
    return
  }

  // Get the user's details
  const result = await fetch(`${host}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({query: '{ user { username } }'})
  })
  const data = await result.json()
  res.send('Final page \n' + JSON.stringify(data))
})
