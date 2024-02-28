/**
 * @description Session options
 */

import { SessionOptions } from 'express-session'

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is not set')
}

export const sessionOptions: SessionOptions= {
  name: 'WT1',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    // one hour
    maxAge: 1000 * 60 * 60,
  },
}