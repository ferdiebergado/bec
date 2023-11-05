import express from 'express';
import serverless from 'serverless-http';
import router from '../../src/server';

const api = express();

api.use('/.netlify/functions/api', router);

export const handler = serverless(api);
