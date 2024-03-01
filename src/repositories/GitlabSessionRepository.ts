/**
 * @module repositories/GitlabSessionRepository
 * @description This module is responsible for holding the active sessions in the GitlabSessionRepository class.
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 *
 */

// Import the ActiveSessions class.
import { ActiveSessions } from "../lib/types/ActiveSessions.js"

// Import the AuthDetails type.
import { AuthDetails, NullAuthDetails } from "../lib/types/AuthDetails.js"

export class GitlabSessionRepository {
  private activeSessions: ActiveSessions

  /**
   * Creates an instance of the GitlabSessionRepository class.
   *
   * @param {Map<string, AuthDetails>} activeSessions - The active sessions.
   */
  constructor(activeSessions: Map<string, AuthDetails>) {
    this.activeSessions = activeSessions
  }

  /**
   * Adds a session to the active sessions.
   *
   * @param {string} sessionId - The session id.
   * @param {AuthDetails} authDetails - The authentication details.
   */
  addSession(sessionId: string, authDetails: AuthDetails): void {
    this.activeSessions.set(sessionId, authDetails)
  }

  /**
   * Gets a session from the active sessions.
   *
   * @param {string} sessionId - The session id.
   * @returns {AuthDetails} - The authentication details.
   */
  getSession(sessionId: string): AuthDetails {
    const session = this.activeSessions.get(sessionId)
    if (session) {
      return session
    } else {
      return new NullAuthDetails()
    }
  }

  /**
   * Deletes a session from the active sessions.
   *
   * @param {string} sessionId - The session id.
   */
  deleteSession(sessionId: string): void {
    this.activeSessions.delete(sessionId)
  }

  /**
   * Checks if a session exists in the active sessions.
   *
   * @param {string} sessionId - The session id.
   * @returns {boolean} - True if the session exists, false otherwise.
   */
  hasSession(sessionId: string): boolean {
    return this.activeSessions.has(sessionId)
  }

  /**
   * Gets all the active sessions.
   *
   * @returns {Map<string, AuthDetails>} - The active sessions.
   */
  getAllSessions(): ActiveSessions {
    return this.activeSessions
  }
}