/**
 * Group data model.
 * The group model is a bit more complex than the other models, as it contains subgroups and projects.
 * It is hence a composite model, containing other models.
 * @class Group
 */
import { Project } from './ProjectModel.js';

export class Group {
  name: string = '';
  description: string = '';
  subgroups: Group[] = [];
  projects: Project[] = [];
  webUrl: string = '';
  hasMoreProjects: boolean = false;

  /**
   * Creates an instance of Group.
   */
  constructor(name: string, description: string) {
    this.setName(name);
    this.setDescription(description);
  }

  /**
   * Verifies and Sets the name.
   * @param {string} name - The name of the group.
   * @throws {Error} - If the name is not a string.
   */
  private setName(name: string) {
    this.verify(name, 'Name');
    this.name = name;
  }

  /**
   * Verifies and Sets the description.
   * @param {string} description - The description of the group.
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

  /**
   * Adds a subgroup to the group.
   * @param {Group} subgroup - The subgroup to add.
   */
  addSubgroup(subgroup: Group) {
    this.subgroups.push(subgroup);
  }

  /**
   * Adds a project to the group.
   * @param {Project} project - The project to add.
   */
  addProject(project: Project) {
    this.projects.push(project);
  }

  /**
   * Removes a subgroup from the group.
   * @param {Group} subgroup - The subgroup to remove.
   */
  removeSubgroup(subgroup: Group) {
    this.subgroups = this.subgroups.filter((sub) => sub !== subgroup);
  }

  /**
   * Removes a project from the group.
   * @param {Project} project - The project to remove.
   */
  removeProject(project: Project) {
    this.projects = this.projects.filter((proj) => proj !== project);
  }
}