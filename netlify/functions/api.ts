import express from 'express';
import serverless from 'serverless-http';
import { router } from '../../src/app';
import path from 'path';
// import config from '../../src/config';

const app = express();
// const { paths } = config;

app.use(express.static(path.join(__dirname, '../../public')));
app.use('/.netlify/functions/api', router);

app.get('/', (_req, res) => {
  //   res.sendFile(path.join(paths.public, 'index.html'));
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});
// app.use(errorHandler);

export const handler = serverless(app);
