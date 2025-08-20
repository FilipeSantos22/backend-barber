import express from 'express';
import type { Request, Response } from 'express';

const app = express();
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('Backend Barber - TypeScript funcionando');
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV ?? 'development'
  });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor rodando em http://localhost:${port}`);
});