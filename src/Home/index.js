import React, {useEffect, useState} from "react";
import investorsStartups from '../utils/matcher';
import parseCSV from "../utils/parseCSV";
import PaginationButton from "../PaginationButton";

function Home() {
  const [matches, setMatches] = useState([]);
  const [deletedStartups, setDeletedStartups] = useState({});

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

// Deleting startups from the list
const deleteStartup = (startupIndex, investorIndex) => {
  setDeletedStartups(prevDeletedStartups => {
      const newDeletedStartups = {...prevDeletedStartups};
      newDeletedStartups[investorIndex] = newDeletedStartups[investorIndex] ? [...newDeletedStartups[investorIndex], startupIndex] : [startupIndex];
      sessionStorage.setItem('deletedStartups', JSON.stringify(newDeletedStartups));
      return newDeletedStartups;
    });
}

// Adding startup back to the list
const addStartup = (investor) => {
  // Remove the last deleted startup from the list of deleted startups
  setDeletedStartups(prevDeletedStartups => {
    const newDeletedStartups = {...prevDeletedStartups};
     if (newDeletedStartups[investor] && newDeletedStartups[investor].length > 0) {
      // Remove the last startup from the list for this investor
      newDeletedStartups[investor] = newDeletedStartups[investor].slice(0, -1);
    }
    sessionStorage.setItem('deletedStartups', JSON.stringify(newDeletedStartups));
    return newDeletedStartups;
  }
  );
}

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

  if (sessionStorage.getItem('investorsData') && localStorage.getItem('startupsData')) {
    const matching = investorsStartups(JSON.parse(sessionStorage.getItem('investorsData')), JSON.parse(localStorage.getItem('startupsData')), deletedStartups);
   
    const matchesGrouped = groupByIndustry(matching);

    setMatches(matchesGrouped);
  } else if (localStorage.getItem('investorsData') && localStorage.getItem('startupsData')) {
    const matching = investorsStartups(JSON.parse(localStorage.getItem('investorsData')), JSON.parse(localStorage.getItem('startupsData')), deletedStartups);
    const matchesGrouped = groupByIndustry(matching);
    setMatches(matchesGrouped);
  } else {
    fetchData();
  }

  

  }, [deletedStartups]);

  useEffect (() => {
       if (sessionStorage.getItem('deletedStartups')) {
    setDeletedStartups(JSON.parse(sessionStorage.getItem('deletedStartups')));    
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
                  match.matches.map((match, indexInv) => {
                    return (
                      <div key={indexInv} className="match">
                        <h3 tabIndex={0} className='investorName'>{match.investorName}</h3>
                        <p className='startups'>
                        {/* Display each startup name in a line */}
                        {match.startups.map((startup, index) => {
                          return(
                            <span key={index} className='startup'>{startup} <button aria-label={`Delete ${startup}`} onClick={() => deleteStartup(startup, match.investorId)}>Delete</button></span>
                          )
                        })}
                        {match.startups.length < 10 && <button onClick={() => addStartup(match.investorId)}>Add Startup</button>}
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
      <PaginationButton text="Dashboard" href='/dashboard' />
    </>
  );
}

export default Home;
