import type { ErrorRequestHandler, RequestHandler,  } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err?.status ?? 500;
  const message = err?.message ?? 'internal_error';
  res.status(status).json({ error: message + ' Rota -> ' + _req.originalUrl });
};

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

