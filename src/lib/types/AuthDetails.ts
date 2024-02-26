/**
 * @file AuthDetails.ts - Defines the AuthDetails type
 * @description AuthDetails is a DTO that holds the code, access token and refresh token.
 * The object is immutable after creation.
 *
 * @module AuthDetails
 * @version 0.0.1
 */

export class AuthDetails{
  code: string | null
  accessToken: string | null;
  refreshToken: string | null;

  constructor (code: string, accessToken: string, refreshToken: string) {
    this.code = code || null
    this.accessToken = accessToken || null
    this.refreshToken = refreshToken || null
    Object.freeze(this)
  }
}

