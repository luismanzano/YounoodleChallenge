import React, {useEffect, useState} from "react";
import Papa from 'papaparse';
import investorsStartups from '../utils/matcher';
import parseCSV from "../utils/parseCSV";

function Home() {
  const [matches, setMatches] = useState([]);

// Function that capitalizes the first letter of a given string and returns the new string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
    const matchesGrouped = groupByIndustry(matching);
    localStorage.setItem('matchedData', JSON.stringify(matchesGrouped));
    setMatches(matchesGrouped);
  };

  const storedMatches = localStorage.getItem('matchedData');
  if (storedMatches) {
    console.log('getting the data from localstorage');
    setMatches(JSON.parse(storedMatches));
  } else {
    fetchData();
  }

  }, []);



  return (
        <>
      <h1 className='title'>Investor-Startup Matcher</h1>
      {
        matches.map((match, index)=> {
          return(
            <div key={index} className="industry">
              <h2 className='industryTitle'>{capitalizeFirstLetter(match.industry)}</h2>
              <div className="matches">
                {
                  match.matches.map((match, index) => {
                    return (
                      <div key={index} className="match">
                        <h3 tabIndex={0} className='investorName'>{match.investorName}</h3>
                        <p className='startups'>
                        {/* Display each startup name in a line */}
                        {match.startups.map((startup, index) => {
                          return(
                            <span key={index} className='startup'>{startup}</span>
                          )
                        })}

                          </p>
                      </div>
                    )
                  })
                }
                </div>
            </div>
          )
        })
      }
    </>
  );
}

export default Home;
