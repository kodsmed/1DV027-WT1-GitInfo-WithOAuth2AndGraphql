/**
 * This class is responsible for parsing the group query and returning the parsed query
 *
 * @class GraphQlGroupQueryParser
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 */

import { Group } from '../models/GroupModel.js';
import { Project } from '../models/ProjectModel.js';
import { GroupQueryResult } from '../models/GroupQueryResult.js';

export class GraphQlGroupQueryParser {
  /**
   * Parses the group query and returns the parsed query
   * @param {any} data - The group query.
   * @returns {GroupQueryResult} - The parsed group query.
   */
  parse(data: any): GroupQueryResult {
    // Create an array to hold the Group objects
    const groups: Group[] = [];

    // Loop through the group data in the GraphQL response
    data.currentUser.groups.edges.forEach((groupEdge: any) => {
      const node = groupEdge.node

      // Set properties for the Group
      const groupName = this.sanitize(node.name)
      const groupDescription =  this.sanitize(node.description)

      // Create Group object
      const group = new Group(groupName || " - ", groupDescription || " - ");
      group.webUrl =  this.sanitize(node.webUrl)

      // Assume Group class has properties for subgroups and projects
      // group.subgroups = [];
      group.projects = []

      // Loop through the project data within the current group
      node.projects.edges.forEach(async (projectEdge: any) => {
        const projectNode = projectEdge.node

        // Create Project object with the constructor
        // The constructor only takes the ever present properties.
        const project = new Project(
          this.sanitize(projectNode.name) || "&nbsp;-&nbsp;",
          this.sanitize(projectNode.description) || "&nbsp;-&nbsp;",
          this.sanitize(projectNode.webUrl) || "./",
          this.sanitize(projectNode.fullPath) || "&nbsp;-&nbsp;",
        );

        // If there is a last commit, set the last commit properties.
        const lastCommit = projectNode.repository.tree.lastCommit || null
        if (!lastCommit) {
          project.lastCommitOnDateString = "&nbsp;-&nbsp;"
          project.lastCommitOnTimeString = "&nbsp;-&nbsp;"
          project.lastCommitAuthor = "&nbsp;-&nbsp;"
        }

        // Set the other properties for the Project if they exist.
        const lastCommittedDate = this.sanitize(lastCommit.committedDate) || null
        const [date, time] = lastCommittedDate?.split('T') || ["&nbsp;-&nbsp;", "&nbsp;-&nbsp;."]
        project.lastCommitOnDateString = date
        project.lastCommitOnTimeString = time.split('.')[0];
        project.lastCommitAuthor = this.sanitize(lastCommit.committerName) || "&nbsp;-&nbsp;"
        project.lastCommitAuthorAvatarURL = this.sanitize(lastCommit.committerAvatarUrl) || "./public/images/default-avatar.png"
        project.projectAvatarURL = this.sanitize(projectNode.avatarUrl) || "./public/images/default-avatar.png"

        // Add the Project object to the group's projects array
        group.addProject(project);
      })

      // Check the projects pageInfo{hasNextPage} and if true, set the group's haveMoreProjects to true
      group.hasMoreProjects = node.projects.pageInfo.hasNextPage || false

      // Add the Group object to the groups array
      groups.push(group)
    });

    // Create the GroupQueryResult object with the groups array
    const allGroups = new GroupQueryResult(groups)

    // allGroups is now a GroupQueryResult object with the parsed group query
    // Check the groups pageInfo{hasNextPage} and if true, set the allGroups haveMoreGroups to true
    allGroups.hasMoreGroups = data.currentUser.groups.pageInfo.hasNextPage || false

    return allGroups
  }

  /**
   * Sanitizes the input string.
   * @param {string} string - The string to sanitize.
   * @returns {string} - The sanitized string.
   */
  private sanitize(string: string): string {
    if (typeof string !== 'string' || string.length === 0) {
      return ''
    }
    // we can't sanitize too hard because we might remove important characters, there are links, urls and such in the data,
    //including query strings. So we'll just remove the most dangerous characters. <> and quotes.
    const sanitized = string.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
    return sanitized
  }
}