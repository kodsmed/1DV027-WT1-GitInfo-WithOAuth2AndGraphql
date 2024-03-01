/**
 * @file OAuthenticator.ts - Defines the OAuthenticator class
 * @description This class is responsible for authenticating users using OAuth2.0, against any OAuth2.0 provider.
 * @module OAuthenticator
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 * @version 1.0.0
 */

import express, { NextFunction } from "express"
import { AuthDetails } from "../lib/types/AuthDetails.js"
import { GitlabApplicationSettings } from "../lib/types/GitlabApplicationSettings.js"

export class OAuthenticator {
  private gitlabApplicationSettings: GitlabApplicationSettings

  /**
   * Creates an instance of the OAuthenticator class.
   *
   * @param {string} clientId - The client id of the application.
   * @param {string} clientSecret - The client secret of the application.
   * @param {string} host - The host of the OAuth2.0 provider.
   */
  constructor(gitlabApplicationSettings: GitlabApplicationSettings) {
    this.gitlabApplicationSettings = gitlabApplicationSettings
  }

  /**
   * Preforms the complete authentication process.
   * @param {string} code - The code to use for authentication.
   * @param {string} redirectURL - The redirect URL to use.
   * @param {string[]} scopes - The scopes to request.
   * @returns {Promise<AuthDetails>} - The authentication details.
   */
  async authenticate(code: string, redirectURL: string): Promise<AuthDetails> {


    const tokenResponse = await fetch(`${this.gitlabApplicationSettings.host}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.gitlabApplicationSettings.applicationID,
        client_secret: this.gitlabApplicationSettings.applicationSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectURL,
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;

    return new AuthDetails(code, accessToken, refreshToken, expiresIn)
  }
}