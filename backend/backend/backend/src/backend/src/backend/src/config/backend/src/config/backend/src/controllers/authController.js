import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

export async function register(req, res, next) {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) throw new AppError('Email is already registered.', StatusCodes.CONFLICT);

    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new AppError('Invalid email or password.', StatusCodes.UNAUTHORIZED);
    }
    res.json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ success: true, user: publicUser(req.user) });
}
