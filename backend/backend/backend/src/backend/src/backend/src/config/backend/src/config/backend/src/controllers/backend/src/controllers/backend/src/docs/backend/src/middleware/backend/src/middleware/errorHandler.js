import { StatusCodes } from 'http-status-codes';

export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = StatusCodes.NOT_FOUND;
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const response = {
    success: false,
    message: err.message || 'Something went wrong',
  };

  if (err.details) response.details = err.details;
  if (process.env.NODE_ENV !== 'production') response.stack = err.stack;

  res.status(statusCode).json(response);
}
