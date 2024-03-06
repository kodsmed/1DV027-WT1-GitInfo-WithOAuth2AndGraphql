/**
 * User Controller... Responsible for fetching the user's data from the Gitlab API.
 * Consequently, it is also responsible for rendering the user's data, that is the home page.
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

    //gitlab and gravatar avatars urls are returned in different formats so we need to check and adjust. If it's not a gravatar url, we need to add the host url to the avatar url.
    let avatarUrl = currentUser.avatarUrl || 'images/default-avatar.png'
    if (avatarUrl.startsWith('/uploads/')) {
      avatarUrl = hostURL + avatarUrl
    }

    return new UserData(
      id || ' - ',
      currentUser.username || ' - ',
      currentUser.name || ' - ',
      currentUser.emails.edges[0].node.email || ' - ',
      avatarUrl,
      currentUser.lastActivityOn || ' - '
    )
  }

  /**
   * Fetches and Then Renders the user's data from the Gitlab API.
   */
  async fetchAndRenderUserData(
    req: express.Request,
    res: express.Response,
    next: NextFunction,
    hostURL: string,
  ) {
    const userData = await this.fetchUserData(req, res, next, hostURL)
    const navLinks = req.navLinks
    const baseURL = req.baseUrl
    res.render('home/user', { baseURL, userData, navLinks })
  }

  /**
   * Display the default home page.
   */
  displayHomePage(req: express.Request, res: express.Response, next: express.NextFunction) {
    const navLinks = req.navLinks
    const baseURL = req.baseUrl
    res.render('home/index', { baseURL, navLinks })
  }
}