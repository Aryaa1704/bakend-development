import { Router } from 'express';
import { createTask, deleteTask, getTask, getTasks, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { taskSchema, updateTaskSchema } from '../middleware/validators.js';

export const taskRouter = Router();

taskRouter.use(protect);
taskRouter.route('/').get(getTasks).post(validate(taskSchema), createTask);
taskRouter.route('/:id').get(getTask).patch(validate(updateTaskSchema), updateTask).delete(deleteTask);
