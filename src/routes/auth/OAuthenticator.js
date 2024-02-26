/**
 * @file OAuthenticator.ts - Defines the OAuthenticator class
 * @description This class is responsible for authenticating users using OAuth2.0, against any OAuth2.0 provider.
 * @module OAuthenticator
 * @author Jimmy Karlsson <jk224jv@student.lnu.se>
 * @version 1.0.0
 */
import { AuthDetails } from "../../lib/types/AuthDetails.js";
export class OAuthenticator {
    clientId;
    clientSecret;
    host;
    /**
     * Creates an instance of the OAuthenticator class.
     *
     * @param {string} clientId - The client id of the application.
     * @param {string} clientSecret - The client secret of the application.
     * @param {string} host - The host of the OAuth2.0 provider.
     */
    constructor(clientId, clientSecret, host) {
        if (!clientId || !clientSecret || !host) {
            throw new Error('clientId, clientSecret and host must be provided');
        }
        if (!this.canCreateURL(host)) {
            throw new Error('host is not a valid URL');
        }
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.host = host;
    }
    /**
     * Check if an URL can be created from the given path.
     */
    canCreateURL(path) {
        try {
            new URL(path);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Preforms the complete authentication process.
     * @param {string} code - The code to use for authentication.
     * @param {string} redirectURL - The redirect URL to use.
     * @param {string[]} scopes - The scopes to request.
     * @returns {Promise<AuthDetails>} - The authentication details.
     */
    async authenticate(code, redirectURL) {
        const tokenResponse = await fetch(`${this.host}/oauth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectURL,
            })
        });
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token;
        const expiresIn = tokenData.expires_in;
        // WARNING: This is a security risk!
        // TODO: Remove this in production!
        if (process.env.NODE_ENV !== 'production') {
            console.log('tokenData:', tokenData);
            console.log('accessToken:', accessToken);
            console.log('refreshToken:', refreshToken);
            console.log('expiresIn:', expiresIn);
        }
        return new AuthDetails(code, accessToken, refreshToken);
    }
}
