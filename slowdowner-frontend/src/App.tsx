import './App.css';
import React from 'react';
import Homepage from './pages/Homepage';
import Songpage from './pages/Songpage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
  <div className="App">
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/song' element={<Songpage />} />
    </Routes>
  </div>
  );
}

export default App;
