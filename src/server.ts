// eslint-disable-next-line @typescript-eslint/no-redeclare
import express, { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import * as path from 'path';
import BudgetEstimate from './budget_estimate';
import { Defaults } from './types';
import ExpenditureMatrix from './expenditure_matrix';
import config from './config';

const app = express();
const router = Router();
const port = process.env.PORT || 3000;

const storageDir = path.join(__dirname, '../storage');
const publicDir = path.join(__dirname, '../public');

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Specify the directory where uploaded files will be stored
    cb(null, storageDir);
  },
  filename: (_req, file, cb) => {
    // Use the original filename as the stored filename
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.use(express.static(publicDir));

router.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

router.get('/download', (_req, res) => {
  res.sendFile(path.join(storageDir, 'be.xlsx'));
});

router.post('/upload', upload.single('excelFile'), async (req, res, next) => {
  try {
    const beXls = req.file?.filename;

    if (beXls) {
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(publicDir, 'error.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default router;
