/**
 * Set up the express server to use the ejs view engine,
 * and tell it where to find the views and layouts.
 */

import { Express, Response, Locals } from 'express'
import { join } from 'path'
import { serverOptions } from './serverOptions.js';
import expressLayouts from 'express-ejs-layouts'
import { ServerOptions } from '../lib/types/serverOptions.js';

export function bootstrapViewEngine(app: Express, res:Response, serverOptions:ServerOptions): void {
  app.set('view engine', 'ejs')
  app.set('views', join(serverOptions.directoryFullName,'../../', 'views'))
  app.use(expressLayouts)
  app.set('layout', join(serverOptions.directoryFullName, '../../', 'views', 'layouts', 'default'))
}