// User-land modules.
import { Container, decorate, inject, injectable } from 'inversify'
import 'reflect-metadata'

// Application modules.
// import { TaskController } from '../controllers/TaskController.js'
// import { TaskModel } from '../models/TaskModel.js'
// import { MongooseRepositoryBase } from '../repositories/MongooseRepositoryBase.js'
// import { TaskRepository } from '../repositories/TaskRepository.js'
// import { MongooseServiceBase } from '../services/MongooseServiceBase.js'
// import { TaskService } from '../services/TaskService.js'

// Define the types to be used by the IoC container.
export const TYPES = {
  TaskController: Symbol.for('TaskController'),
  TaskRepository: Symbol.for('TaskRepository'),
  TaskService: Symbol.for('TaskService'),
  TaskModelClass: Symbol.for('TaskModelClass')
}

// Declare the injectable and its dependencies.
// decorate(injectable(), MongooseRepositoryBase)
// decorate(injectable(), MongooseServiceBase)
// decorate(injectable(), TaskRepository)
// decorate(injectable(), TaskService)
// decorate(injectable(), TaskController)

// decorate(inject(TYPES.TaskModelClass), TaskRepository, 0)
// decorate(inject(TYPES.TaskRepository), TaskService, 0)
// decorate(inject(TYPES.TaskService), TaskController, 0)

// Create the IoC container.
export const container = new Container()

// Declare the bindings.
// container.bind(TYPES.TaskController).to(TaskController).inSingletonScope()
// container.bind(TYPES.TaskRepository).to(TaskRepository).inSingletonScope()
// container.bind(TYPES.TaskService).to(TaskService).inSingletonScope()
// container.bind(TYPES.TaskModelClass).toConstantValue(TaskModel)
