/** app.ts
 * 
 * montar middlewares (cors, bodyParser, helmet, logger, requestId)
 * registrar rotas e docs (/docs)
 * expor endpoints de health/readiness simples
 * middleware centralizado de erros
 * export default app (sem listen)
*/

import express from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler, notFound } from './middlewares/error';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use(notFound);      // 404 handler
app.use(errorHandler);  // middleware de erro central
export default app;