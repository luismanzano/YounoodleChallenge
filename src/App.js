import React, {useEffect} from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {

  useEffect(() => {
    const parseCSV = (filePath) => {
      Papa.parse(filePath, {
        download: true,
        header: true,
        complete: function(results) {
          return results.data;
        }
      });
    
    }

    const investors = parseCSV(`${process.env.PUBLIC_URL}/investors.csv`);
    const startups = parseCSV(`${process.env.PUBLIC_URL}/startups.csv`);
  }, []);



  return (
    <div className="App">
      <h1>Investor-Startup Matcher</h1>
    </div>
  );
}

export default App;
