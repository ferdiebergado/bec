import path from 'path';
import BudgetEstimate from '../budget_estimate';
import ExpenditureMatrix from '../expenditure_matrix';
import { ExpenditureMatrixCell } from '../types';
import config from '../config';

const xlsBe = path.join(config.paths.storage, 'be.xlsx');
const xlsEm = config.paths.emTemplate;
const beWs = 'BAE-BE-001';
const emWs = 'Expenditure Form';
const be = new BudgetEstimate(xlsBe, beWs);
const em = new ExpenditureMatrix(xlsEm, emWs);

beforeAll(async () => {
  await be.load();
  await em.load();
});

test('writes the info', async () => {
  em.apply(be);

  const outFile = await em.save();

  const expected = 'Oriented galaxy heads';

  expect(em.ws?.getCell(ExpenditureMatrixCell.OUTPUT).text).toBe(expected);

  const em2 = new ExpenditureMatrix(outFile, emWs);

  await em2.load();

  expect(em2.ws?.getCell(ExpenditureMatrixCell.OUTPUT).text).toBe(expected);
});
