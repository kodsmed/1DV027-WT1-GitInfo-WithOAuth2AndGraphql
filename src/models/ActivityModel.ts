/**
 * A DTO class for the Activity model.
 * @class Activity
 * @property {string} activity - The activity name. (Pushed, Pulled, Committed, etc.)
 * @property {string} type - The type of activity. (Issue, Discussion Note, Merge Request, etc.)
 * @property {string} timeOfActivity - The time when the activity was performed.
 */
export class Activity {
  activity: string = '';
  type: string = '';
  dayOfActivity: string = '';
  timeOfActivity: string = '';

  /**
   * Creates an instance of Activity.
   */
  constructor(activity: string, type: string, timeOfActivity: string) {
    this.setActivity(activity);
    this.setType(type);
    this.setTime(timeOfActivity);
  }

  /**
   * Verifies and Sets the activity.
   * @param {string} activity - The activity name.
   * @throws {Error} - If the activity is not a string.
   */
  private setActivity(activity: string) {
    if (typeof activity !== 'string') {
      throw new Error('Activity must be a string.');
    }

    this.activity = activity;
  }

  /**
   * Verifies and Sets the type.
   * @param {string} type - The type of activity.
   * @throws {Error} - If the type is not a string.
   */
  private setType(type: string) {
    if (typeof type !== 'string') {
      throw new Error('Type must be a string.');
    }
    this.type = type;
  }

  private verify(string: string, name: string) {
    if (typeof string !== 'string') {
      throw new Error(`${name} must be a string.`);
    }

    if (string.length === 0) {
      throw new Error(`${name} cannot be empty.`);
    }

    if (string.length > 32) {
      throw new Error(`${name} cannot be longer than 32 characters.`);
    }
  }

  /**
   * Verifies and Sets the time.
   * @param {string} timeOfActivity - The time when the activity was performed.
   * @throws {Error} - If the time is not a string.
   */
  private setTime(timeOfActivity: string) {
    this.verifyTime(timeOfActivity);

    // Split the date and time.
    const [date, timeString] = timeOfActivity.split('T');
    const [hours, minutes, seconds] = timeString.split(':');
    this.dayOfActivity = `${date}`;
    this.timeOfActivity = `${hours}:${minutes}`;
  }

  private verifyTime(time: string) {
    if (typeof time !== 'string') {
      throw new Error('Time must be a string.');
    }

    // Must match the format of a date string. "2017-02-09T10:43:19.426Z"
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(time)) {
      throw new Error('Time must be a valid date string.');
    }

    // Must be a valid date.
    if (isNaN(Date.parse(time))) {
      throw new Error('Time must be a valid date.');
    }

    // Must be in the past.
    if (new Date(time) > new Date()) {
      throw new Error('Time must be in the past.');
    }
  }
}

// Consider eunmeration for activity and type?