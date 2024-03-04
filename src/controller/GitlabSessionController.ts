/**
 * Defines the GitlabSessionController class
 * @module GitlabSessionController
 * @version 1.0.0
 * @description This class is responsible for handling the sessions the user have with GitLab.
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */
// Import packages
import express, { request, response, NextFunction, Response, Request } from 'express'

// Import modules
import { GitlabSessionService } from '../services/GitlabSessionService.js'
import { GitlabApplicationSettings } from '../lib/types/GitlabApplicationSettings.js'
import { GitlabSessionRepository } from '../repositories/GitlabSessionRepository.js'

// Import types
import { AuthDetails, NullAuthDetails } from '../lib/types/AuthDetails.js'
import { OAuthenticator } from '../services/OAuthenticator.js'
import { ActiveSessions } from '../lib/types/ActiveSessions.js'

// Import the extended express request object
import { ExtendedRequest } from '../lib/types/req-extentions.js';

/**
 * The Gitlab session controller.
 */
export class GitlabSessionController {
  private gitlabSessionService: GitlabSessionService

  /**
   * Creates an instance of the GitlabSessionController class.
   *
   * @param {GitlabSessionService} gitlabSessionService - The Gitlab session service.
   */
  constructor(gitlabSessionService: GitlabSessionService) {
    this.gitlabSessionService = gitlabSessionService
  }

  /**
   * Login to GitLab through OAuth2.0.
   * Finish the login process by exchanging the code for a token.
   */
  async login(
    req: ExtendedRequest,
    res: express.Response,
    next: NextFunction,
    oAuthenticator: OAuthenticator,
    activeSessions: ActiveSessions,
    redirectURLBase: string
  ): Promise<void> {
    // Deconstruct the code from the query string
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
        res.redirect('/');
      });
    } catch (error) {
      console.error('Error exchanging code for token', error);
      res.status(401).redirect('/');
    }
  }

  /**
   * Adds a session to the active sessions.
   *
   * @param {string} sessionId - The session id.
   * @param {AuthDetails} authDetails - The authentication details.
   */
  addSession(sessionId: string, authDetails: AuthDetails): void {
    this.gitlabSessionService.addSession(sessionId, authDetails)
  }

  /**
   * Gets a session from the active sessions.
   *
   * @param {string} sessionId - The session id.
   * @returns {AuthDetails} - The authentication details.
   */
  getSession(sessionId: string): AuthDetails {
    return this.gitlabSessionService.getSession(sessionId)
  }

  /**
   * Deletes a session from the active sessions.
   *
   * @param {string} sessionId - The session id.
   */
  deleteSession(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const sessionId = req.session?.UUID
    this.gitlabSessionService.deleteSession(sessionId)
    // Destroy the session and redirect the user to the home page.
    if (req.session) {
      req.session.destroy(() => {
        res.redirect('/')
      })
    } else {
      res.redirect('/')
    }
  }

  /**
   * Checks if a session exists in the active sessions.
   *
   * @param {string} sessionId - The session id.
   */
  hasSession(sessionId: string): boolean {
    return this.gitlabSessionService.hasSession(sessionId)
  }

  /**
   * Updates a session.
   */
  refreshSession(sessionId: string, oAuthenticator: OAuthenticator, authDetails: AuthDetails): void {

    const code = authDetails.code
    const refreshToken = authDetails.refreshToken
    const newAuthDetails = oAuthenticator.refresh(code, refreshToken)

    this.gitlabSessionService.updateSession(sessionId, authDetails)
  }

  /**
   * Gets all the active sessions.
   *
   * @returns {Map<string, AuthDetails>} - The active sessions.
   */
  getAllSessions(): Map<string, AuthDetails> {
    return this.gitlabSessionService.getAllSessions()
  }

  /**
   * Clear all Expired sessions.
   */
  clearExpiredSessions(): void {
    this.gitlabSessionService.clearExpiredSessions()
  }
}
