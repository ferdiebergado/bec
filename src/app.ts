// eslint-disable-next-line @typescript-eslint/no-redeclare
import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import BudgetEstimate from './budget_estimate';
import { Defaults } from './types';
import ExpenditureMatrix from './expenditure_matrix';
import config from './config';
import { timestamp } from './utils';

const app = express();
const publicDir = config.paths.public;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Specify the directory where uploaded files will be stored
    cb(null, config.paths.workDir);
  },
  filename: (_req, file, cb) => {
    // Use the original filename as the stored filename
    // cb(null, file.originalname);
    cb(null, `budget-${timestamp()}.xlsx`);
  },
});

const upload = multer({ storage });

app.use(express.static(publicDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.post('/convert', upload.single('excelFile'), async (req, res, next) => {
  try {
    const file = req.file;

    if (file) {
      const beXls = file.path;

      const be = new BudgetEstimate(beXls, Defaults.BE_SHEET_NAME);
      await be?.load();

      const emXls = config.paths.emTemplate;
      const em = new ExpenditureMatrix(emXls, Defaults.EM_SHEET_NAME);
      await em.load();

      em.apply(be);

      const outputFile = await em.save();
      const outFilename = path.parse(outputFile).base;

      res.download(outputFile, outFilename);
    }
  } catch (error) {
    next(error);
  }
});

// Custom error handler middleware
const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(publicDir, 'error.html'));
};

app.use(errorHandler);

export default app;
