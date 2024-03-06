import express from 'express';

// Import modules
import { ActiveSessions } from '../lib/types/ActiveSessions.js'
import { ExtendedRequest } from '../lib/types/req-extentions.js'
import { GraphQlGroupQueryParser } from '../services/GraphQlGroupQueryParser.js';
import { GroupQueryResult } from '../models/GroupQueryResult.js';
import { Group } from '../models/GroupModel.js';
import { GitlabSessionService } from '../services/GitlabSessionService.js';

export class GroupController {
  private service: GitlabSessionService

  constructor(service: GitlabSessionService) {
    this.service = service
  }

  async getGroups(req: ExtendedRequest, res: express.Response, next: express.NextFunction, activeSessions: ActiveSessions, host: string) {
    // Get the user's details
    const result = await fetch(`${host}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeSessions.get(req.session.UUID)?.accessToken}`
      },
      body: JSON.stringify({
        query: `
        {
          currentUser {
            groups(first: 3, permissionScope: CREATE_PROJECTS) {
              edges {
                node {
                  name
                  description
                  avatarUrl
                  webUrl
                  fullPath
                  projects(includeSubgroups: true, first: 5) {
                    edges {
                      node {
                        name
                        description
                        avatarUrl
                        lastActivityAt
                        fullPath
                        webUrl
                        repository {
                          tree {
                            lastCommit {
                              committedDate
                              committerName
                              author{
                                username
                              }
                              authorGravatar
                              descriptionHtml
                            }
                          }
                        }
                      }
                    },
                    pageInfo{hasNextPage}
                  }
                }
              }, pageInfo{hasNextPage}
            }
          }
        }
      `
      })
    })
    const data = await result.json()
    const groupsData = data.data
    const parser = new GraphQlGroupQueryParser()
    const parsedGroups = parser.parse(groupsData) as GroupQueryResult

    return parsedGroups
  }

  /**
   * Fetches the groups from the GitLab API and then renders the groups page.
   */
  async renderGroupData(req: express.Request, res: express.Response, next: express.NextFunction, activeSessions: ActiveSessions, queryResult: GroupQueryResult) {
    const navLinks = req.navLinks
    const baseURL = req.baseUrl
    res.render('groups/groups', { baseURL, navLinks, groups:queryResult.groups, haveMoreGroups: queryResult.hasMoreGroups})
  }
}
