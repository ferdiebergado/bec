import express from 'express';
import serverless from 'serverless-http';
import { router, staticHandler } from '../../src/server';
import config from '../../src/config';
import path from 'path';

const app = express();
const { paths } = config;

app.use(staticHandler);

app.get('/', (_req, res) => {
  res.sendFile(path.join(paths.public, 'index.html'));
});
// app.use(errorHandler);
app.use('/.netlify/functions/api', router);

export const handler = serverless(app);
