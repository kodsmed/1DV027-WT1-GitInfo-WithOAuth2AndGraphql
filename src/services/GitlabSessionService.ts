/**
 * This service is responsible for managing the Gitlab sessions.
 * @module GitlabSessionService
 * @NOTE SIDE EFFECT: Every action taken will clear expired sessions.
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */
import { AuthDetails, NullAuthDetails } from '../lib/types/AuthDetails.js'
import { GitlabSessionRepository } from '../repositories/GitlabSessionRepository.js'

/**
 * The Gitlab session service.
 */
export class GitlabSessionService {
  private gitlabSessionRepository: GitlabSessionRepository

  /**
   * Creates an instance of the GitlabSessionService class.
   *
   * @param {GitlabSessionRepository} gitlabSessionRepository - The Gitlab session repository.
   */
  constructor(gitlabSessionRepository: GitlabSessionRepository) {
    this.gitlabSessionRepository = gitlabSessionRepository
  }

  /**
   * Adds a session to the active sessions.
   *
   * @param {string} sessionId - The session id.
   * @param {AuthDetails} authDetails - The authentication details.
   */
  addSession(sessionId: string, authDetails: AuthDetails): void {
    this.validateSessionId(sessionId)
    this.gitlabSessionRepository.addSession(sessionId, authDetails)
  }

  /**
   * Validates the session id, if it is not valid an error will be thrown.
   * It should be a string of the expected format.
   */
  private validateSessionId(sessionId: string): void {
    if (typeof sessionId !== 'string') {
      throw new Error('SessionID must be a string')
    }
    let regex = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/i;
    if (!regex.test(sessionId)) {
      throw new Error('Session id must be a valid UUID')
    }
  }

  /**
   * Gets a session from the active sessions.
   *
   * @param {string} sessionId - The session id.
   * @returns {AuthDetails} - The authentication details.
   */
  getSession(sessionId: string): AuthDetails {
    this.validateSessionId(sessionId)
    if (!this.hasSession(sessionId)) {
      throw new Error('Session does not exist')
    }
    return this.gitlabSessionRepository.getSession(sessionId)
  }

  /**
   * Deletes a session from the active sessions.
   *
   * @param {string} sessionId - The session id.
   */
  deleteSession(sessionId: string): void {
    this.validateSessionId(sessionId)
    if (!this.hasSession(sessionId)){
      throw new Error('Session does not exist')
    }
    this.gitlabSessionRepository.deleteSession(sessionId)
  }

  /**
   * Checks if a session exists in the active sessions.
   *
   * @param {string} sessionId - The session id.
   * @returns {boolean} - True if the session exists, false otherwise.
   */
  hasSession(sessionId: string): boolean {
    this.validateSessionId(sessionId)
    return this.gitlabSessionRepository.hasSession(sessionId)
  }

  /**
   * Gets all the active sessions.
   *
   * @returns {Map<string, AuthDetails>} - The active sessions.
   */
  getAllSessions(): Map<string, AuthDetails> {
    return this.gitlabSessionRepository.getAllSessions()
  }

  /**
   * "Updates" a session... by deleting the old one and adding a new one.
   *
   * @param {string} sessionId - The session id.
   * @param {AuthDetails} authDetails - The authentication details.
   */
  updateSession(sessionId: string, authDetails: AuthDetails): void {
    this.validateSessionId(sessionId)
    if (!this.hasSession(sessionId)){
      throw new Error('Session does not exist')
    }
    this.gitlabSessionRepository.deleteSession(sessionId)
    this.gitlabSessionRepository.addSession(sessionId, authDetails)
  }

  /**
   * Clears expired sessions.
   */
  clearExpiredSessions(): void {
    const allSessions = this.gitlabSessionRepository.getAllSessions()
    allSessions.forEach((authDetails, sessionId) => {
      if (authDetails.isExpired()) {
        this.gitlabSessionRepository.deleteSession(sessionId)
      }
    })
  }
}