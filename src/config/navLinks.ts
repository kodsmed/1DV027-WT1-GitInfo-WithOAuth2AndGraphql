/**
 * Set the navigation links based on the user's authentication status.
 * These are passed to the view engine to render the navigation links in the header.
 * Thus, the view does not need to know the user's authentication status it just gets a set of links to render either way.
 */

import { serverOptions } from "./serverOptions.js";

// Set the adaptiveBase to an empty string if the baseURL is '/'. Otherwise, set it to the baseURL.
const adaptiveBase = serverOptions.baseURL === '/' ? '' : serverOptions.baseURL;

const nonAuthenticatedLinks = [
  { href: `${adaptiveBase}/auth/gitlab`, text: 'Login with Gitlab' }
];

const authenticatedLinks = [
  { href: `${adaptiveBase}/activities`, text: 'Activities' },
  { href: `${adaptiveBase}/groups`, text: 'Groups' },
  { href: `${adaptiveBase}/auth/logout`, text: 'Logout' }
];

export const navLinks = {
  nonAuthenticatedLinks,
  authenticatedLinks
};