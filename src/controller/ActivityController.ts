/**
 * Controller for Activity route
 */
import express from 'express'

// Import modules
import { GitlabSessionService } from '../services/GitlabSessionService.js'
import { ExtendedRequest } from '../lib/types/req-extentions.js' // appears to be unused but is required for the decorator to work
import { UserController } from './UserController.js'
import { container, TYPES } from '../config/inversify.config.js'
import { UserData } from '../models/UserData.js'
import { Activity } from '../models/ActivityModel.js'
import { gitlabApplicationSettings } from '../config/gitlabApplicationSettings.js'

/**
 * The Activity Controller.
 */
export class ActivityController {
  private sessionService: GitlabSessionService

  /**
   * Creates an instance of the ActivityController class.
   */
  constructor(service: GitlabSessionService) {
    this.sessionService = service
  }

  /**
   * Gets all the activities.
   *
   * @param {number} limit - The maximum number of activities to retrieve.
   * @returns {Activity[]} - The list of activities.
   */
  async getActivities(req: express.Request, res: express.Response, next: express.NextFunction, limit: number): Promise<Activity[]> {
    // Get the users access token
    const token = this.sessionService.getSession(req.session.UUID).accessToken
    const hostURL = gitlabApplicationSettings.host

    // get the user's activities from the Gitlab API
    const allActivities = []
    const userController = container.get<UserController>(TYPES.UserController)
    const user = await userController.fetchUserData(req, res, next, hostURL) as UserData
    const userId = user.gitLabID


    // fetch 10 activities at a time until we have the required number of activities
    let page = 1
    const perPage = 20
    while (allActivities.length < limit) {
      let pagesThisRun = 0
      if (limit - allActivities.length < perPage) {
        pagesThisRun = limit - allActivities.length
      } else {
        pagesThisRun = perPage;
      }
      // Fetch the activities. The it should include all activities, not just the ones the user has done, so scope=all. Remove scope=all to only get the user's activities.
      const result = await fetch(`${hostURL}/api/v4/users/${userId}/events?&page=${page}&per_page=${pagesThisRun}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const activities = await result.json()
      if (activities.length === 0) {
        break
      } else {
      allActivities.push(...activities)
      }
      page++
    }

    const activityObjects = [] as Activity[]
    let activityCount = 1
    for (const activity of allActivities) {
      let title = ' - '
      if (activity.target_title) {
        title = activity.target_title
      } else if (activity.push_data?.commit_title) {
        title = activity.push_data.commit_title
      }
      let type = ' - '
      if (activity.action_name !== 'pushed to' && activity.target_type) {
        type = activity.target_type
      } else if (activity.push_data && activity.push_data.commit_count > 0 && activity.push_data.ref) {
        type = activity.push_data.commit_count + ' files ' + activity.action_name + ' ' + activity.push_data.ref
      }

      activityObjects.push(
        new Activity(
          activityCount,
          type,
          activity.action_name,
          title,
          activity.created_at
        )
      )
      activityCount++
    }

    return activityObjects
  }

  /**
   * Get and render the activities.
   *
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   * @param {express.NextFunction} next - The next function.
   * @param {Activity[]} activities - The activities to render.
   * @throws {Error} - If the activities cannot be retrieved.
   */
  async renderActivities(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    activities: Activity[]) {
    try {
      const baseURL = req.baseUrl
      const navLinks = req.navLinks
      res.render('activities/activities', { baseURL, activities, navLinks })
    } catch (error) {
       next(new Error('Failed to retrieve activities'))
    }
  }
}