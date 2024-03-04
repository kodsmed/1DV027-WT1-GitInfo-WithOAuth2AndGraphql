/**
 * A DTO class for the Activity model.
 * @class Activity
 * @property {string} activity - The activity name. (Pushed, Pulled, Committed, etc.)
 * @property {string} type - The type of activity. (Issue, Discussion Note, Merge Request, etc.)
 * @property {string} timeOfActivity - The time when the activity was performed.
 */
export class Activity {
  number: number = 0;
  activity: string = '';
  description: string = '';
  type: string = '';
  dayOfActivity: string = '';
  timeOfActivity: string = '';

  /**
   * Creates an instance of Activity.
   */
  constructor(
    number:number,
    type: string,
    activity: string,
    title: string,
    timeOfActivity: string
  ) {
    this.number = number;
    this.setActivity(activity);
    this.setType(type);
    this.setTitle(title);
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

  /**
   * Verifies the input string.
   * @param {string} string - The string to verify.
   * @param {string} name - The name of the string.
   * @param {number} length - The maximum length of the string. Default is 32.
   * @throws {Error}
   */
  private verify(string: string, name: string, length: number = 32) {
    if (typeof string !== 'string') {
      throw new Error(`${name} must be a string.`);
    }

    if (string.length === 0) {
      throw new Error(`${name} cannot be empty.`);
    }

    if (string.length > length) {
      throw new Error(`${name} cannot be longer than ${length} characters.`);
    }
  }

  /**
   * Verifies and Sets the description.
   */
  private setTitle(description: string) {
    this.verify(description, 'Description', 256);
    this.description = description;
  }

  /**
   * Verifies and Sets the time.
   * @param {string} timeOfActivity - The time when the activity was performed.
   * @throws {Error} - If the time is not a string.
   */
  private setTime(timeOfActivity: string) {
    this.verifyTime(timeOfActivity);

    // Split the date and time.
    const dateObject = new Date(timeOfActivity)
    const year: number = dateObject.getFullYear()
    const month: number = dateObject.getMonth() + 1 // month is 0 indexed, so we add 1 to compensate.
    const day: number = dateObject.getDate()
    const hour: number = dateObject.getHours()
    const minute: number = dateObject.getMinutes()

    // convert to string
    const monthString = month < 10 ? `0${month}` : `${month}`
    const dayString = day < 10 ? `0${day}` : `${day}`
    const hourString = hour < 10 ? `0${hour}` : `${hour}`
    const minuteString = minute < 10 ? `0${minute}` : `${minute}`

    // Set the date and time.
    this.dayOfActivity = `${year}-${monthString}-${dayString}`
    this.timeOfActivity = `${hourString}:${minuteString}`
  }

  private verifyTime(time: string) {
    if (typeof time !== 'string') {
      throw new Error('Time must be a string.');
    }

    // Must match the format of a date string. "2017-02-09T10:43:19.426Z"
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\+\d{2}:\d{2}$/.test(time)) {
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