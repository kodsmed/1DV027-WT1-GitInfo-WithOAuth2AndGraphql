// User-land modules.
import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'

// Application modules.
import { GitlabSessionRepository } from '../repositories/GitlabSessionRepository.js'
import { GitlabSessionService } from '../services/GitlabSessionService.js'
import { GitlabSessionController } from '../controller/GitlabSessionController.js'
import { UserController } from '../controller/UserController.js'
import { GitlabSessionModelPlaceholder } from '../models/GitlabSessionModel.js'

// Import types
import { AuthDetails } from '../lib/types/AuthDetails.js'

// Define the types to be used by the IoC container.
export const TYPES = {
  GitlabSessionModel: Symbol.for('GitlabSessionModelPlaceholder'),
  GitlabSessionRepository: Symbol.for('GitlabSessionRepository'),
  GitlabSessionService: Symbol.for('GitlabSessionService'),
  GitlabSessionController: Symbol.for('GitlabSessionController'),
  UserController: Symbol.for('UserController')
}

// Declare the injectable and its dependencies.
decorate(injectable(), GitlabSessionModelPlaceholder)
decorate(injectable(), GitlabSessionRepository)
decorate(injectable(), GitlabSessionService)
decorate(injectable(), GitlabSessionController)
decorate(injectable(), UserController)

// Feed the dependencies to the injectable.
// NOTE: The repository currently has no dependencies, but IF for some reason we want to swap the Map for a database, it is now prepared for it.
decorate(inject(TYPES.GitlabSessionModel), GitlabSessionRepository, 0)
decorate(inject(TYPES.GitlabSessionRepository), GitlabSessionService, 0)
decorate(inject(TYPES.GitlabSessionService), GitlabSessionController, 0)
decorate(inject(TYPES.GitlabSessionService), UserController, 0)

// Create the IoC container.
export const container = new Container()

// Declare the bindings.
container.bind(TYPES.GitlabSessionModel).toDynamicValue(() => GitlabSessionModelPlaceholder()).inSingletonScope();
container.bind(TYPES.GitlabSessionRepository).to(GitlabSessionRepository).inSingletonScope()
container.bind(TYPES.GitlabSessionService).to(GitlabSessionService).inSingletonScope()
container.bind(TYPES.GitlabSessionController).to(GitlabSessionController).inSingletonScope()
container.bind(TYPES.UserController).to(UserController).inSingletonScope()

