/**
 * @file AuthDetails.ts - Defines the AuthDetails type
 * @description AuthDetails is a DTO that holds the code, access token and refresh token.
 * The object is immutable after creation.
 *
 * @module AuthDetails
 * @version 0.0.1
 */

export class AuthDetails{
  code: string
  accessToken: string;
  refreshToken: string;

  constructor (code: string, accessToken: string, refreshToken: string) {
    this.code = code
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    Object.freeze(this)
  }
}

