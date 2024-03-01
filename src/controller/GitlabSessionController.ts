/**
 * Defines the GitlabSessionController class
 * @module GitlabSessionController
 * @version 1.0.0
 * @description This class is responsible for handling the sessions the user have with GitLab.
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */
// Import modules
import { GitlabSessionService } from '../services/GitlabSessionService.js'
import { GitlabSessionRepository } from '../repositories/GitlabSessionRepository.js'

// Import types
import { AuthDetails, NullAuthDetails } from '../lib/types/AuthDetails.js'

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
  deleteSession(sessionId: string): void {
    this.gitlabSessionService.deleteSession(sessionId)
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
  refreshSession(sessionID: string, authDetails: AuthDetails): void {
    this.gitlabSessionService.updateSession(sessionID, authDetails)
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
