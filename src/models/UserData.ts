/**
 * Define the User Data Model, a DTO to hold the user's data from the Gitlab API.
 * 
 */
export class UserData {
  gitLabID: string
  username: string
  name: string
  email: string
  avatarURL: string
  lastActivityYYYYMMDD: string

  /**
   * Creates an instance of the UserData class.
   *
   * @param {string} gitLabID - The user's Gitlab ID.
   * @param {string} username - The user's username.
   * @param {string} name - The user's name.
   * @param {string} email - The user's email.
   * @param {string} avatarURL - The user's avatar URL.
   * @param {string} lastActivityYYYYMMDD - The user's last activity date.
   */
  constructor(
    gitLabID: string,
    username: string,
    name: string,
    email: string,
    avatarURL: string,
    lastActivityYYYYMMDD: string
  ) {
    this.gitLabID = gitLabID
    this.username = username
    this.name = name
    this.email = email
    this.avatarURL = avatarURL
    this.lastActivityYYYYMMDD = lastActivityYYYYMMDD
  }
}