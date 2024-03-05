import { serverOptions } from "./serverOptions.js";

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