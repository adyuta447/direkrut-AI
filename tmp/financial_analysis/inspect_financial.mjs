import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/yutaaa/Downloads/Simifinal Financial Analysis Direkrut AI.xlsx";
const outDir = "/Users/yutaaa/Developments/direkrut-AI/tmp/financial_analysis/rendered";
await fs.mkdir(outDir, { recursive: true });

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const sheets = await workbook.inspect({
  kind: "sheet",
  include: "id,name",
  maxChars: 12000,
});
console.log("=== SHEETS ===");
console.log(sheets.ndjson);

console.log("=== WORKBOOK OVERVIEW ===");
const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 20000,
  tableMaxRows: 12,
  tableMaxCols: 16,
  tableMaxCellChars: 120,
});
console.log(overview.ndjson);

for (const sheet of workbook.worksheets.items) {
  const used = sheet.getUsedRange();
  const name = sheet.name;
  console.log(`=== USED RANGE: ${name} ===`);
  if (used) {
    console.log(JSON.stringify({
      address: used.address,
      rowCount: used.rowCount,
      columnCount: used.columnCount,
    }));
  } else {
    console.log("EMPTY");
  }
  const safe = name.replace(/[^A-Za-z0-9_-]+/g, "_");
  const preview = await workbook.render({
    sheetName: name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(path.join(outDir, `${safe}.png`), new Uint8Array(await preview.arrayBuffer()));
}
