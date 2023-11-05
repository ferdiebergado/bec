import BudgetEstimate from "./budget_estimate";

const xls = "storage/be.xlsx";
const ws = "BAE-BE-001";
const be = new BudgetEstimate(xls, ws);

(async () => {
  await be.load();

  // console.log(be.month);


  console.table(be.expenseItems);
})();
