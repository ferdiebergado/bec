import BudgetEstimate from '../src/budget_estimate';
import { ExpenseGroup, GAAObject, MannerOfRelease } from '../src/types';

const xls = 'storage/be.xlsx';
const ws = 'BAE-BE-001';
const be = new BudgetEstimate(xls, ws);

beforeAll(async () => {
  await be.load();
});

test('returns instance attributes', async () => {
  expect(be.venue).toBe('BUTUAN');
  expect(be.totalPax).toBe(85);
});

test('parses board and lodging', () => {
  const expenseItem = be.boardLodging();

  let expected = {
    expenseGroup: ExpenseGroup.TRAINING_SCHOLARSHIPS_EXPENSES,
    gaaObject: GAAObject.TRAINING_EXPENSES,
    expenseItem: 'Board and Lodging of Participants',
    quantity: 41,
    freq: 5,
    unitCost: 1500,
    ppmp: 'N',
    appSupplies: 'N',
    appTicket: 'N',
    mannerOfRelease: MannerOfRelease.FOR_DOWNLOAD_BOARD,
  };

  expect(expenseItem[0]).toEqual(expected);

  expected = {
    expenseGroup: ExpenseGroup.TRAINING_SCHOLARSHIPS_EXPENSES,
    gaaObject: GAAObject.TRAINING_EXPENSES,
    expenseItem: 'Board and Lodging of Other Offices',
    quantity: 8,
    freq: 5,
    unitCost: 2000,
    ppmp: 'N',
    appSupplies: 'N',
    appTicket: 'N',
    mannerOfRelease: MannerOfRelease.FOR_DOWNLOAD_BOARD,
  };

  expect(expenseItem[4]).toEqual(expected);
});

test('parses travel expenses', () => {
  const expenseItems = be.travelExpenses();

  let expected = {
    expenseGroup: ExpenseGroup.TRAINING_SCHOLARSHIPS_EXPENSES,
    gaaObject: GAAObject.TRAINING_EXPENSES,
    expenseItem: 'Travel Expenses of Region I',
    quantity: 2,
    freq: 1,
    unitCost: 13900,
    ppmp: 'N',
    appSupplies: 'N',
    appTicket: 'N',
    mannerOfRelease: MannerOfRelease.FOR_DOWNLOAD_PSF,
  };

  expect(expenseItems[0]).toEqual(expected);
  expect(expenseItems.length).toBe(22);

  expected = {
    expenseGroup: ExpenseGroup.TRAINING_SCHOLARSHIPS_EXPENSES,
    gaaObject: GAAObject.TRAINING_EXPENSES,
    expenseItem: 'Travel Expenses of Resource Persons',
    quantity: 8,
    freq: 1,
    unitCost: 13400,
    ppmp: 'N',
    appSupplies: 'N',
    appTicket: 'N',
    mannerOfRelease: MannerOfRelease.DIRECT_PAYMENT,
  };

  expect(expenseItems[18]).toEqual(expected);
});

test('parses honorarium', () => {
  const expenseItem = be.honorarium();

  let expected = {
    expenseGroup: ExpenseGroup.TRAINING_SCHOLARSHIPS_EXPENSES,
    gaaObject: GAAObject.TRAINING_EXPENSES,
    expenseItem: 'Honorarium of Resource Persons',
    quantity: 8,
    freq: 1,
    unitCost: 30000,
    ppmp: 'N',
    appSupplies: 'N',
    appTicket: 'N',
    mannerOfRelease: MannerOfRelease.DIRECT_PAYMENT,
  };

  expect(expenseItem[0]).toEqual(expected);
});

test('parses supplies and contingency', () => {
  const expenseItems = be.suppliesContingency();

  let supplies = {
    expenseGroup: ExpenseGroup.SUPPLIES_EXPENSES,
    gaaObject: GAAObject.OTHER_SUPPLIES,
    expenseItem: 'Supplies and Materials',
    quantity: 85,
    freq: 1,
    unitCost: 100,
    ppmp: 'N',
    appSupplies: 'Y',
    appTicket: 'N',
    mannerOfRelease: MannerOfRelease.CASH_ADVANCE,
  };

  let contingency = {
    expenseGroup: ExpenseGroup.TRAINING_SCHOLARSHIPS_EXPENSES,
    gaaObject: GAAObject.TRAINING_EXPENSES,
    expenseItem: 'Contingency',
    quantity: 1,
    freq: 1,
    unitCost: 4500,
    ppmp: 'N',
    appSupplies: 'N',
    appTicket: 'N',
    mannerOfRelease: MannerOfRelease.CASH_ADVANCE,
  };

  expect(expenseItems[0]).toEqual(supplies);
  expect(expenseItems[1]).toEqual(contingency);
});

test('parses all expenses', () => {
  const expenses = be.expenseItems;

  expect(expenses.length).toBe(31);
});
