import type { RequestHandler, ErrorRequestHandler, NextFunction, Request, Response, } from 'express';
import { HttpError } from '../utils/httpError';

export const notFound: RequestHandler = (_req, res) => {
    res.status(404).json({ error: 'Route not found' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const isHttp = err instanceof HttpError;
    const status = isHttp ? err.status : 500;
    const message = err?.message ?? 'internal_error';

    // em dev pode logar stack; em produção omitir detalhes
    // console.error(err);

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV !== 'production' ? { stack: err?.stack } : {})
    });
};

/**
 * Wrapper para controllers async: captura erros e chama next(err)
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler =>
  (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
  };