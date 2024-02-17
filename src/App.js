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
        resolve(results.data);
      },
      error: function(err) {
        reject(err);
      }
    });
  });
}

// Group by the matches by investor's industry and return an array of objects
const groupByIndustry = (matches) => {
  return matches.reduce((acc, match) => {
    const industry = match.investorIndustry;
    const existing = acc.find(item => item.industry === industry);
    if (existing) {
      existing.matches.push(match);
    } else {
      acc.push({ industry, matches: [match] });
    }
    return acc;
  }
  , []);
};


    // Use effect to call the parsing function when component mounts and update investor list
  useEffect(() => {
    const fetchData = async () => {
    const investorsData = await parseCSV(`${process.env.PUBLIC_URL}/investors.csv`);
    const startupsData = await parseCSV(`${process.env.PUBLIC_URL}/startups.csv`);

    const matching = investorsStartups(await investorsData, await startupsData);
    setMatches(groupByIndustry(matching));
  };

  fetchData();

  

  }, []);



  return (
    
    <div className="App">
      <h1>Investor-Startup Matcher</h1>
      {
        matches.map((match, index)=> {
          return(
            <div key={index} className="industry">
              <h2 className='industryTitle'>Industry: {match.industry}</h2>
              <div className="matches">
                {
                  match.matches.map((match, index) => {
                    return (
                      <div key={index} className="match">
                        <h3 className='investorName'>{match.investorName}</h3>
                        <p className='interest'>Interest: {match.investorIndustry}</p>
                        <p className='startupList'>Startups: {match.startups.join(', ')}</p>
                      </div>
                    )
                  })
                }
                </div>
            </div>
          )
        })
      }
    </div>
  );
}

export default App;
