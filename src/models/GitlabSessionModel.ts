/**
 * GitlabSessionModel
 *
 * @description Placeholder for the GitlabSessionModel class, it returns a map of sessions instead of a database model.
 * @module GitlabSessionModel
 * @version 1.0.0
 * @author Jimmy Karlsson<jk224jv@student.lnu.se>
 */

import { AuthDetails, NullAuthDetails } from '../lib/types/AuthDetails.js'

/**
 * The Gitlab session model.
 */
export const GitlabSessionModelPlaceholder = () => {
  return new Map<string, AuthDetails>()
}