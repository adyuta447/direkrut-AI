import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/yutaaa/Downloads/Simifinal Financial Analysis Direkrut AI.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));

const ranges = [
  ["Direkrut AI Financial", "A3:J18"],
  ["Direkrut AI Financial", "A21:J32"],
  ["Direkrut AI Financial", "A34:N68"],
  ["Direkrut AI Financial", "A70:G93"],
  ["Direkrut AI Financial", "A96:J131"],
  ["Cashflow & CAPEX-OPEX", "A4:L20"],
  ["Cashflow & CAPEX-OPEX", "A23:H70"],
  ["Cashflow & CAPEX-OPEX", "A97:H175"],
  ["Cashflow & CAPEX-OPEX", "A200:N214"],
];

for (const [sheetName, address] of ranges) {
  const sheet = workbook.worksheets.getItem(sheetName);
  const range = sheet.getRange(address);
  console.log(`=== ${sheetName}!${address} VALUES ===`);
  console.log(JSON.stringify(range.values));
  console.log(`=== ${sheetName}!${address} FORMULAS ===`);
  console.log(JSON.stringify(range.formulas));
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  maxChars: 20000,
  summary: "formula errors",
});
console.log("=== FORMULA ERRORS ===");
console.log(errors.ndjson);
