/**
 * @description Server options
 */
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

if(!process.env.EXPRESS_PORT) {
  throw new Error('EXPRESS_PORT is not set');
}

const fullPath = dirname(fileURLToPath(import.meta.url));

export const serverOptions = {
  port: process.env.EXPRESS_PORT,
  baseURL: process.env.BASE_URL || '/',
  directoryFullName: fullPath,
  publicPath: join(fullPath, '..', '..', 'public'),
}