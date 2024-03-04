const nonAuthenticatedLinks = [
  { href: '/auth/gitlab', text: 'Login with Gitlab' }
];

const authenticatedLinks = [
  { href: '/activities', text: 'Activities' },
  { href: '/groups', text: 'Groups' },
  { href: '/auth/logout', text: 'Logout' }
];

export const navLinks = {
  nonAuthenticatedLinks,
  authenticatedLinks
};