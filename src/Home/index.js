import React, {useEffect, useState} from "react";
import investorsStartups from '../utils/matcher';
import parseCSV from "../utils/parseCSV";
import PaginationButton from "../PaginationButton";

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const groupByIndustry = (matches) => matches.reduce((acc, match) => {
  const { investorIndustry: industry } = match;
  const existing = acc.find(item => item.industry === industry);
  existing ? existing.matches.push(match) : acc.push({ industry, matches: [match] });
  return acc;
}, []);

function Home() {
  const [matches, setMatches] = useState([]);
  const [deletedStartups, setDeletedStartups] = useState({});

// Deleting startups from the list
  const deleteStartup = (startupIndex, investorIndex) => setDeletedStartups(prev => {
    const updated = { ...prev, [investorIndex]: [...(prev[investorIndex] || []), startupIndex] };
    sessionStorage.setItem('deletedStartups', JSON.stringify(updated));
    return updated;
  });

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
      const matchesGrouped = groupByIndustry(investorsStartups(investorsData, startupsData, deletedStartups));
      localStorage.setItem('matchedData', JSON.stringify(matchesGrouped));
      setMatches(matchesGrouped);
    };

    const sessionInvestors = sessionStorage.getItem('investorsData');
    const localStartups = localStorage.getItem('startupsData');
    if (sessionInvestors && localStartups) {
      const matching = investorsStartups(JSON.parse(sessionInvestors), JSON.parse(localStartups), deletedStartups);
      setMatches(groupByIndustry(matching));
    } else if (!sessionInvestors && !localStartups) {
      fetchData();
    }
  }, [deletedStartups]);

   useEffect(() => {
    const storedDeletedStartups = sessionStorage.getItem('deletedStartups');
    if (storedDeletedStartups) setDeletedStartups(JSON.parse(storedDeletedStartups));
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
