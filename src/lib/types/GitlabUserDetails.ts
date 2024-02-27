/**
 * Creates a DTO containing the details of a Gitlab user.
 *
 * @param {string} id - The ID of the user.
 * @param {string} username - The username of the user.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} avatar - The avatar of the user.
 * @param {date} lastActivity - The last activity of the user.
 */
export class GitlabUserDetails {
  id: string
  username: string
  name: string
  email: string
  avatar: string
  lastActivity: Date

  constructor(id: string, username: string, name: string, email: string, avatar: string, lastActivity: Date) {
    this.id = id
    this.username = username
    this.name = name
    this.email = email
    this.avatar = avatar
    this.lastActivity = lastActivity
  }
}