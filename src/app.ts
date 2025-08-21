import express from 'express';
import cors from 'cors';
import usuariosRouter from './routes/usuarios.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuariosRouter);

// middleware de erro simples
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'internal_error' });
});

export default app;