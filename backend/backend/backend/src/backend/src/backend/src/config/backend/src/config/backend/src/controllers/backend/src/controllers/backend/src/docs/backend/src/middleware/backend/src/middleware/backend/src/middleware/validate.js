import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError.js';

export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((item) => item.message);
      return next(new AppError('Validation failed', StatusCodes.BAD_REQUEST, details));
    }
    req.body = value;
    next();
  };
}
