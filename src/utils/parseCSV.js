import Papa from 'papaparse';

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: function(results) {
        resolve(results.data);
      },
      error: function(err) {
        reject(err);
      }
    });
  });
}

export default parseCSV;