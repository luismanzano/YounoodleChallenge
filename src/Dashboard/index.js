import React, { useState, useEffect } from 'react';
import parseCSV from '../utils/parseCSV';
import './styles.css';
import PaginationButton from '../PaginationButton';

function Dashboard() {
  const [investors, setInvestors] = useState([]);
  const [investorName, setInvestorName] = useState('');
  const [industry, setIndustry] = useState('any');

  useEffect(() => {
    const loadData = async () => {
      const sessionData = sessionStorage.getItem('investorsData');
      const localData = localStorage.getItem('investorsData');
      
      if (sessionData) {
        setInvestors(JSON.parse(sessionData));
      } else if (localData) {
        setInvestors(JSON.parse(localData));
      } else {
        const [investorsData, startupsData] = await Promise.all([
          parseCSV(`${process.env.PUBLIC_URL}/investors.csv`),
          parseCSV(`${process.env.PUBLIC_URL}/startups.csv`)
        ]);
        setInvestors(investorsData);
        localStorage.setItem('investorsData', JSON.stringify(investorsData));
        localStorage.setItem('startupsData', JSON.stringify(startupsData));
      }
    };

    loadData();
  }, []);

//   Add investor
  const addInvestor = (event) => {
    event.preventDefault();
    const newInvestor = { name: investorName, industry };
    setInvestors(prevInvestors => [...prevInvestors, newInvestor]);
    sessionStorage.setItem('investorsData', JSON.stringify([...investors, newInvestor]));
    setInvestorName('');
    setIndustry('any');
    alert('New Investor Successfully Added');
  };

//   Edit investor name
  const editInvestorName = (investorId) => {
    const newName = prompt('Enter new name');
    if (!newName) {
      alert("Name cannot be empty");
      return;
    }
    const updatedInvestors = investors.map((investor, index) => 
      index === investorId ? { ...investor, name: newName } : investor
    );
    setInvestors(updatedInvestors);
    sessionStorage.setItem('investorsData', JSON.stringify(updatedInvestors));
  };

    



  return (
    <div>
      <h1>Dashboard</h1>
     {/* Investors List */}
     {/* Input to add investor */}
        {/* Input to add investor */}
      <form onSubmit={addInvestor}>
        <input 
          aria-label='Investor Name Input'
          type="text" 
          className='investorNameInput'
          placeholder="Investor Name" 
          value={investorName} 
          onChange={e => setInvestorName(e.target.value)} 
          required 
        />
        <select 
          aria-label='Investor Industry Input'
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
        <PaginationButton text='Home' href='/' />
    </div>
  );
}

export default Dashboard;