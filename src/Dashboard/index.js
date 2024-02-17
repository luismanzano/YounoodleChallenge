import React, { useState, useEffect } from 'react';
import parseCSV from '../utils/parseCSV';

function Dashboard() {
  const [investors, setInvestors] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    console.log('useEffect');
    // Load investors from session/local storage
    const sessionData = sessionStorage.getItem('dashboardData');
    const localData = localStorage.getItem('dashboardData');
    if (sessionData) {
        console.log('checking for session data');
      setInvestors(JSON.parse(sessionData));
    } else if (localData) {
        console.log("checking for local data");
        setInvestors(JSON.parse(localData));
        } else {
            console.log('fetching data');
            const fetchData = async () => {
            const investorsData = await parseCSV(`${process.env.PUBLIC_URL}/investors.csv`);
            console.log('investorsData', investorsData);
            const startupsData = await parseCSV(`${process.env.PUBLIC_URL}/startups.csv`);
            setInvestors(investorsData);
            localStorage.setItem('investorsData', JSON.stringify(investorsData));
            localStorage.setItem('startupsData', JSON.stringify(startupsData));
  };
            fetchData();
        }
  }, []);

//   Add investor
const addInvestor = (newInvestor) => {
  const updatedMatches = [...investors, newInvestor]; 
  setInvestors(updatedMatches);
  sessionStorage.setItem('investorsData', JSON.stringify(updatedMatches));
};

  return (
    <div>
      <h1>Dashboard</h1>
     {/* Investors List */}
        <ul>
        {investors.map((investor, index) => {
            return <li key={index}>{investor}</li>
        })}
        </ul>
    </div>
  );
}

export default Dashboard;