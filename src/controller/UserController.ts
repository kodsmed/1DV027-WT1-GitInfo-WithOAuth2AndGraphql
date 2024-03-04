/**
 * User Controller... Responsible for fetching the user's data from the Gitlab API.
 */

// Import packages
import express, { request, response, NextFunction } from 'express'

// Import modules
import { GitlabSessionService } from '../services/GitlabSessionService.js'
import { ActiveSessions } from '../lib/types/ActiveSessions.js'
import { ExtendedRequest } from '../lib/types/req-extentions.js'
import { UserData } from '../models/UserData.js'

/**
 * The Gitlab session controller.
 */
export class UserController {
  private gitlabSessionService: GitlabSessionService

  /**
   * Creates an instance of the GitlabSessionController class.
   *
   * @param {GitlabSessionService} gitlabSessionService - The Gitlab session service.
   */
  constructor(gitlabSessionService: GitlabSessionService) {
    this.gitlabSessionService = gitlabSessionService
  }

  /**
   * Fetches the user's data from the Gitlab API.
   */
  async fetchUserData(
    req: ExtendedRequest,
    res: express.Response,
    next: NextFunction,
    hostURL: string
  ): Promise<UserData | void> {

    const token = this.gitlabSessionService.getSession(req.session.UUID).accessToken

    // Get the user's details
    let data
    try {
      const result = await fetch(`${hostURL}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query {
              currentUser {
                id
                name
                username,
                avatarUrl,
                lastActivityOn,
                emails{
                  edges{
                    node{email}
                  }
                }
              }
            }
          `
        })
      })
      data = await result.json()
      if (!data) {
        console.error('No user data found. Redirecting to home page.')
        res.status(401).redirect('/')
      }
    } catch (error) {
      console.error('Error fetching user data', error)
      res.status(401).redirect('/')
    }

    if (!data?.data?.currentUser) {
      console.log('no currentUser:', data)
      next(new Error('No user data found'))
    }
    const currentUser = data.data.currentUser
    // split id on the last slash and take the last part
    const id = currentUser.id.split('/').pop()
    return new UserData(
      id || ' - ',
      currentUser.username || ' - ',
      currentUser.name || ' - ',
      currentUser.emails.edges[0].node.email || ' - ',
      currentUser.avatarUrl || '/images/default-avatar.png',
      currentUser.lastActivityOn || ' - '
    )
  }

  /**
   * Fetches and Then Renders the user's data from the Gitlab API.
   */
  async fetchAndRenderUserData(
    req: ExtendedRequest,
    res: express.Response,
    next: NextFunction,
    activeSessions: ActiveSessions,
    hostURL: string,
    baseURL: string
  ) {
    const userData = await this.fetchUserData(req, res, next, hostURL)
    const navLinks = req.navLinks
    res.render('home/user', { baseURL, userData, navLinks })
  }

  /**
   * Display the default home page.
   */
  displayHomePage(req: ExtendedRequest, res: express.Response, next: express.NextFunction, baseURL: string) {
    const navLinks = req.navLinks
    res.render('home/index', { baseURL, navLinks })
  }
}