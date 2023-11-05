import Excel from 'exceljs';
import path from 'path';
import config from './config';

class Worksheet {
  xls: string;

  sheet: string;

  wb: Excel.Workbook;

  ws?: Excel.Worksheet;

  storagePath: string;

  constructor(xls: string, sheet: string) {
    this.xls = xls;
    this.sheet = sheet;
    this.wb = new Excel.Workbook();
    this.ws = undefined;
    this.storagePath = config.paths.storage;
  }

  async load() {
    await this.wb.xlsx.readFile(path.join(this.storagePath, this.xls));

    this.ws = this.wb.getWorksheet(this.sheet);
  }
}

export default Worksheet;
