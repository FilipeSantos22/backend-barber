/** server.ts
 * 
 * ler config/ENV (dotenv)
 * criar conexão DB (import db) e garantir pool pronto
 * executar app.listen(port)
 * interceptar SIGINT/SIGTERM para graceful shutdown (fechar server, pool DB, jobs)
 * opcional: clustering (node:cluster) ou deixar orquestrador (Kubernetes/PM2) fazer scaling
 * iniciar instrumentação (metrics/Prometheus, tracing)
*/

import app from './app';

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
    // eslint-disable-next-line no-console

    console.log(`Servidor rodando em http://localhost:${port}`);
});