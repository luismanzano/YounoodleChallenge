import React, { useState, useEffect } from 'react';
import parseCSV from '../utils/parseCSV';

function Dashboard() {
  const [investors, setInvestors] = useState([]);
  const [investorName, setInvestorName] = useState('');
  const [industry, setIndustry] = useState('any');

  useEffect(() => {
    console.log('useEffect');
    // Load investors from session/local storage
    const sessionData = sessionStorage.getItem('investorsData');
    const localData = localStorage.getItem('investorsData');
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
            console.log('investors', investors);
            localStorage.setItem('investorsData', JSON.stringify(investorsData));
            localStorage.setItem('startupsData', JSON.stringify(startupsData));
  };
            fetchData();
            
        }
  }, []);

//   Add investor
const addInvestor = (event) => {
    event.preventDefault();
    const newInvestor = { name: investorName, industry: industry };
    const updatedMatches = [...investors, newInvestor];
    console.log('updatedMatches', updatedMatches);
    setInvestors(updatedMatches);
    sessionStorage.setItem('investorsData', JSON.stringify(updatedMatches));
    setInvestorName('');
    setIndustry('any');
  };

//   Edit investor name
const editInvestorName = (investorId) => {
    const newName = prompt('Enter new name');
    if (newName === null) {
        alert("Name cannot be empty");
        return;
    }
    console.log('newName', newName);
    console.log('investorId', investorId);
  const updatedInvestors = investors.map((investor, index) => 
    index === investorId ? { ...investor, name: newName } : investor
  );
  setInvestors(updatedInvestors);
  // Update session/local storage
sessionStorage.setItem('investorsData', JSON.stringify(updatedInvestors));
localStorage.setItem('investorsData', JSON.stringify(updatedInvestors));
};

    



  return (
    <div>
      <h1>Dashboard</h1>
     {/* Investors List */}
     {/* Input to add investor */}
        {/* Input to add investor */}
      <form onSubmit={addInvestor}>
        <input 
          type="text" 
          placeholder="Investor Name" 
          value={investorName} 
          onChange={e => setInvestorName(e.target.value)} 
          required 
        />
        <select 
          name="industry" 
          value={industry} 
          onChange={e => setIndustry(e.target.value)} 
          required
        >
          <option value="any">Any</option>
          <option value="bio">Bio</option>
          <option value="internet">Internet</option>
          <option value="environment">Environment</option>
        </select>
        <button type="submit">Add Investor</button>
      </form>
        <ul>
        {investors.map((investor, index) => {
            return <li key={index}>
                <div className='listName'>{investor.name}</div>  
                <div className='listIndustry'>{investor.industry}</div>
                <button onClick={() => editInvestorName(index)}>Edit</button>
                </li>;
        })}
        </ul>
    </div>
  );
}

export default Dashboard;