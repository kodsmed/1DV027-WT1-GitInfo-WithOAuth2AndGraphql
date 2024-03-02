/**
 * This is the model for the result of a group query
 */

import { Group } from './GroupModel.js';

export class GroupQueryResult {
  groups: Group [];

  /**
   * Creates an instance of GroupQueryResult.
   */
  constructor(groups: Group[]) {
    this.groups = groups;
  }
}