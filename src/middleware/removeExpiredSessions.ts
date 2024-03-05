/**
 * Middleware to remove expired sessions from the database.
 */
import { container, TYPES } from '../config/inversify.config.js'
import { GitlabSessionService } from '../services/GitlabSessionService.js'
import express from 'express'
import { ExtendedRequest } from '../lib/types/req-extentions.js'

export const removeExpiredSessions =(req: ExtendedRequest, res: express.Response, next: express.NextFunction) => {
  const gitlabSessionService = container.get<GitlabSessionService>(TYPES.GitlabSessionService)
  gitlabSessionService.clearExpiredSessions()
  next()
}