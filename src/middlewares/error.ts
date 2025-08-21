import type { RequestHandler, ErrorRequestHandler, NextFunction, Request, Response, } from 'express';

export const notFound: RequestHandler = (_req, res) => {
    res.status(404).json({ error: 'Route not found' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    const status = (err && err.status) || 500;
    const message = (err && err.message) || 'internal_error';
    res.status(status).json({ error: message });
};

/**
 * Wrapper para controllers async: captura erros e chama next(err)
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };