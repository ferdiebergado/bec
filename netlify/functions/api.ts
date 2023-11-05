import express from 'express';
import serverless from 'serverless-http';
import { router, staticHandler } from '../../src/app';
// import config from '../../src/config';
// import path from 'path';

const app = express();
// const { paths } = config;

app.use(express.static('../../public'));
app.use('/.netlify/functions/api', router);

app.get('/', (_req, res) => {
  //   res.sendFile(path.join(paths.public, 'index.html'));
  res.sendFile('../../public/index.html');
});
// app.use(errorHandler);

export const handler = serverless(app);
