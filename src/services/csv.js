const csvParse = require('csv-parse/lib/sync');
const arraytocsv = require('convert-array-to-csv').default;

const fromCsv = (csvContent, options) => {
  const content = csvParse(csvContent, options);
  return content;
};

const toCsv = (jsonContent) => {
  const csvContent = arraytocsv(jsonContent);
  return csvContent;
};

module.exports = {
  fromCsv,
  toCsv,
};
