/**
 * Project Model
 * The project model is a simple DTO class to hold the project data.
 */
export class Project {
  name: string = ''
  description: string = ''
  webUrl: string = ''
  fullPath: string = ''
  lastCommitOnDateString: string = ''
  lastCommitOnTimeString: string = ''
  lastCommitAuthor: string = ''
  lastCommitAuthorAvatarURL: string = ''
  projectAvatarURL: string = ''

  /**
   * Creates an instance of Project.
   */
  constructor(
    name: string,
    description: string,
    webURL: string,
    fullPath: string,
  ) {
    this.setName(name)
    this.setDescription(description)
    this.webUrl = webURL
    this.fullPath = fullPath
  }
  /**
   * Verifies and Sets the name.
   * @param {string} name - The name of the project.
   * @throws {Error} - If the name is not a string.
   */
  private setName(name: string) {
    this.verify(name, 'Name');
    this.name = name;
  }
  /**
   * Verifies and Sets the description.
   * @param {string} description - The description of the project.
   * @throws {Error} - If the description is not a string.
   */
  private setDescription(description: string) {
    this.verify(description, 'Description');
    this.description = description;
  }
  /**
   * Verifies the input string.
   * @param {string} string - The string to verify.
   * @param {string} name - The name of the string.
   * @throws {Error} - If the string is not a string, empty or longer than 32 characters.
   */
  private verify(string: string, name: string) {
    if (typeof string !== 'string') {
      throw new Error(`${name} must be a string.`);
    }
    if (string.length === 0) {
      throw new Error(`${name} cannot be empty.`);
    }
    if (string.length > 256) {
      throw new Error(`${name} cannot be longer than 256 characters.`);
    }
  }
}