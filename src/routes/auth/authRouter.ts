/**
 * @file authRouter.ts - Defines the routs for all authentication related endpoints
 * @module authRouter
 * @version 0.0.1
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */

import express from 'express'
import { OAuthenticator } from '../../services/OAuthenticator.js'
import { ActiveSessions } from '../../lib/types/ActiveSessions.js'
import { ServerOptions } from '../../lib/types/serverOptions.js'
import { GitlabApplicationSettings } from '../../lib/types/GitlabApplicationSettings.js'

// Import the AuthDetails type
import { AuthDetails } from '../../lib/types/AuthDetails.js'

// Import the extended express request object
import ExtendedRequest from '../../lib/types/req-extentions.js';

export default function createAuthRouter(
  activeSessions: ActiveSessions,
  oAuthenticator: OAuthenticator,
  serverOptions: ServerOptions,
  gitlabApplicationSettings: GitlabApplicationSettings
): express.Router {
  const authRouter = express.Router()
  const app = express()

  const port = serverOptions.port
  const host = gitlabApplicationSettings.host
  // The base URL for the redirect URL, by splitting it like this we can easily add the callback path later.
  // Thus allowing us to use the same base URL for additional OAuth2.0 providers, if we want to add more in the future.
  const redirectURLBase = `http://localhost:${port}/auth/`;
  const scopes = ['read_user', 'read_api']


  authRouter.get('/gitlab', (req, res, next) => {
    // Redirect the user to the OAuth2.0 provider
    const completeRedirectURL = redirectURLBase + 'gitlab-callback';
    const authURL = `${host}/oauth/authorize?client_id=${gitlabApplicationSettings.applicationID}&redirect_uri=${completeRedirectURL}&response_type=code&scope=${scopes.join('%20')}`;
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
      const authDetails = await oAuthenticator.authenticate(code as string, completeRedirectURL) as AuthDetails

      // Ok, logged in... create a session and then use the activeSessions map to store the session paired with the gitlab credentials.
      req.session.UUID = req.requestUuid;

      req.session.save((err: Error) => {
        activeSessions.set(req.session.UUID, authDetails)
        if (err) {
          return next(err);
        }
        res.redirect('/auth/final');
      });
    } catch (error) {
      console.error('Error exchanging code for token', error);
      res.status(500).send('Authentication failed');
    }
  })

  authRouter.get('/final', async (req, res, next) => {
    if (!req.requestUuid) {
      // This should never happen, but if it does, we need to know about it.
      next(new Error('UUID not found in session'))
      return
    }
    const activeSession = activeSessions.get(req.requestUuid) as AuthDetails
    if (!activeSessions.has(req.requestUuid)) {
      // If the user is not logged in, redirect them to the home page.
      res.redirect('/')
    } else {

      // Get the user's details
      const result = await fetch(`${host}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeSessions.get(req.session.UUID)?.accessToken}`
        },
        body: JSON.stringify({
          query: `
            query {
              currentUser {
                id
                name
                emails{
                  edges{
                    node{email}
                  }
                }
              }
            }
          `
        })
      })
      const data = await result.json()
      res.send('Final page \n' + JSON.stringify(data))
    }
  })

  authRouter.get('/cookie-set', (req, res) => {
    req.session.UUID = req.requestUuid;
    res.send('Cookie set');
  })

  authRouter.get('/cookie-get', (req, res) => {
    // Replace 'cookieName' with the actual name of the cookie you want to retrieve
    if (req.session.UUID) {
      res.send('UUID \n' + req.session.UUID);
    } else {
      res.send('Please login to view your dashboard');
    }
  })

  return authRouter
}
