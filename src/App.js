import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import investorsStartups from './utils/matcher';
import './App.css';

function App() {
  const [matches, setMatches] = useState([]);

  // Function to parse CSV file to JSON
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      complete: function(results) {
        console.log(results.data);
        resolve(results.data);
      },
      error: function(err) {
        reject(err);
      }
    });
  });
}

    // Use effect to call the parsing function when component mounts and update investor list
  useEffect(() => {
    const fetchData = async () => {
    const investorsData = await parseCSV(`${process.env.PUBLIC_URL}/investors.csv`);
    const startupsData = await parseCSV(`${process.env.PUBLIC_URL}/startups.csv`);

    console.log('investor', investorsData);
    console.log('startups', startupsData);

    const matching = investorsStartups(await investorsData, await startupsData);
    console.log('matching', matching);
    setMatches(matching);
  };

  fetchData();

  }, []);



  return (
    <div className="App">
      <h1>Investor-Startup Matcher</h1>
    </div>
  );
}

export default App;
