/**
 * Defines the settings for the Gitlab application
 * @interface GitlabApplicationSettings
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

export interface GitlabApplicationSettings {
  applicationID: string,
  applicationSecret: string,
  host: string,
  callbackURL: string,
  gitLabAuthURL: string
}
