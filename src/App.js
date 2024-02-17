import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import investorsStartups from './utils/matcher';
import './App.css';
import Home from './Home/index'

function App() {
 
  return (
    
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
