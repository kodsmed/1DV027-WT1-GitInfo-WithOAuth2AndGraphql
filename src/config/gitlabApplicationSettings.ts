/**
 * Gitlab Application Settings
 */

// Verify that the required environment variables are set.
if (!process.env.GITLAB_CLIENT_ID) {
  throw new Error('GITLAB_CLIENT_ID is not set');
}
if (!process.env.GITLAB_CLIENT_SECRET) {
  throw new Error('GITLAB_CLIENT_SECRET is not set');
}
if (!process.env.GITLAB_HOST_URL) {
  throw new Error('GITLAB_HOST_URL is not set');
}
if(!process.env.EXPRESS_PORT) {
  throw new Error('EXPRESS_PORT is not set');
}

export const gitlabApplicationSettings = {
  applicationID: process.env.GITLAB_CLIENT_ID,
  applicationSecret: process.env.GITLAB_CLIENT_SECRET,
  host: process.env.GITLAB_HOST_URL,
  callbackURL: `http://localhost:${process.env.EXPRESS_PORT}/oauth-callback/`,
  gitLabAuthURL: `${process.env.GITLAB_HOST_URL}/oauth/authorize`
}
