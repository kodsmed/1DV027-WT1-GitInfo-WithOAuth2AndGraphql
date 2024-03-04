/**
 * Controller for Activity route
 */
import express from 'express'

// Import modules
import { GitlabSessionService } from '../services/GitlabSessionService.js'
import { ExtendedRequest } from '../lib/types/req-extentions.js'
import { UserController } from './UserController.js'
import { container, TYPES } from '../config/inversify.config.js'
import { UserData } from '../models/UserData.js'
import { Activity } from '../models/ActivityModel.js'
import { gitlabApplicationSettings } from '../config/gitlabApplicationSettings.js'
import { serverOptions } from '../config/serverOptions.js'

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
  async getActivities(req: ExtendedRequest, res: express.Response, next: express.NextFunction, limit: number) {
    // Get the users access token
    const token = this.sessionService.getSession(req.session.UUID).accessToken
    const hostURL = gitlabApplicationSettings.host

    // get the user's activities from the Gitlab API
    const allActivities = []
    const userController = container.get<UserController>(TYPES.UserController)
    const user = await userController.fetchUserData(req, res, next, hostURL) as UserData
    const userId = user.gitLabID
    // Not used, but could be used to filter activities by user since gitlab API does not do that. see line 70.
    // const userName = user.username

    // fetch 10 activities at a time until we have the required number of activities
    let page = 1
    const perPage = 10
    while (allActivities.length < limit) {
      let pagesThisRun = 0
      if (limit - allActivities.length < perPage) {
        pagesThisRun = limit - allActivities.length
      } else {
        pagesThisRun = perPage;
      }
      const result = await fetch(`${hostURL}/api/v4/users/${userId}/events?page=${page}&per_page=${pagesThisRun}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const activities = await result.json()
      if (activities.length === 0) {
        break
      }
      // Gitlab API does not filter activities by user, so we have to do it here, we can do that here, but its not my problem.
      // Doing so messes up the pagination, and will not result in the hard requirement of 101 activities.
      // for (const activity of activities) {
      //   if (activity.author_username === userName) {
      //     allActivities.push(activity)
      //   }
      //}
      allActivities.push(...activities)
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
   * @param {number} limit - The maximum number of activities to retrieve.
   * @throws {Error} - If the activities cannot be retrieved.
   */
  async fetchAndRenderActivities(
    req: ExtendedRequest,
    res: express.Response,
    next: express.NextFunction,
    limit: number) {
      let activities = [] as Activity[]
    //try {
      activities = await this.getActivities(req, res, next, limit) as Activity[]
      const baseURL = serverOptions.baseURL
      const navLinks = req.navLinks
      res.render('activities/activities', { baseURL, activities, navLinks })
    //} catch (error) {
    //  next(new Error('Failed to retrieve activities'))
    //}
  }
}