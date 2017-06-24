import * as express from 'express';
import { registerLog } from '../../utils/logger';
import { testQueueMany, runUpdater } from "../../_workers/updater/updater";

export const app = express();
app.use((req, res, next) => { registerLog(req as any); next(); });

app.get('/api/test-updater', async (req, res) => {
  res.json({
    a: await testQueueMany(),
    b: await runUpdater(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    pattern: '/api',
  });
});
