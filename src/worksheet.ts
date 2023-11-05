import Excel from 'exceljs';
import config from './config';

class Worksheet {
  xls: string;

  sheet: string;

  wb: Excel.Workbook;

  ws?: Excel.Worksheet;

  workDir: string;

  constructor(xls: string, sheet: string) {
    this.xls = xls;
    this.sheet = sheet;
    this.wb = new Excel.Workbook();
    this.ws = undefined;
    this.workDir = config.paths.workDir;
  }

  async load() {
    await this.wb.xlsx.readFile(this.xls);

    this.ws = this.wb.getWorksheet(this.sheet);
  }
}

export default Worksheet;
