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
          groups {
            edges {
              node {
                name,
                description,
                avatarUrl,
                webUrl,
                fullPath,
                projects {
                  edges {
                    node {
                      id,
                      name,
                      description,
                      avatarUrl,
                      lastActivityAt,
                      webUrl,
                    }
                  }
                }
              }
            }
          }
        }
      }
      `
      })
    })
    const data = await result.json()
    const groups = data.data.currentUser.groups.edges
    console.log(groups)
    const parser = new GraphQlGroupQueryParser()
    const parsedGroups = parser.parse(groups) as GroupQueryResult
    res.send('Final page \n' + parsedGroups)
  }
}
