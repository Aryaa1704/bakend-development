import { StatusCodes } from 'http-status-codes';
import { Task } from '../models/Task.js';
import { AppError } from '../utils/AppError.js';

function taskFilter(user) {
  return user.role === 'admin' ? {} : { owner: user._id };
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.create({ ...req.body, owner: req.user._id });
    res.status(StatusCodes.CREATED).json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

export async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find(taskFilter(req.user)).sort('-createdAt');
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, ...taskFilter(req.user) });
    if (!task) throw new AppError('Task not found.', StatusCodes.NOT_FOUND);
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, ...taskFilter(req.user) }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) throw new AppError('Task not found.', StatusCodes.NOT_FOUND);
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, ...taskFilter(req.user) });
    if (!task) throw new AppError('Task not found.', StatusCodes.NOT_FOUND);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}
