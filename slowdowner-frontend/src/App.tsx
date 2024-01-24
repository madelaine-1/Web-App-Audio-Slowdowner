import './App.css';
import React, { useState } from 'react';
import Loginpage from './pages/Loginpage';
import Homepage from './pages/Homepage';
import Songpage from './pages/Songpage';
import { Route, Routes } from 'react-router-dom';

function App() {
  const [token, setToken] = useState<string | null>();

  if (!token) {
    return (<Loginpage setToken={setToken}/>);
  }

  return (
  <div className="App">
    <Routes>
      <Route path='/home' element={<Homepage />} />
      <Route path='/song' element={<Songpage />} />
    </Routes>
  </div>
  );
}

export default App;
