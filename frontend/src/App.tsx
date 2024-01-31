import './App.css';
import React, { useState, useEffect, useContext, createContext } from 'react';
import Homepage from './pages/Homepage';
import Songpage from './pages/Songpage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Route, Routes, Navigate } from 'react-router-dom';
import { SERVER_URL } from './shared functions/constants';
import Cookies from 'js-cookie';
import axios from 'axios';

function App() {
  const [isValidToken, setIsValidToken] = useState<boolean>(false);

  // check if token is valid
  useEffect(() => {
    const access_token = Cookies.get("token");
    if(access_token === undefined) {return;}

    axios({
      method: 'post',
      url: `${SERVER_URL}/users/validate-token/`,
      data: access_token,
    })
    .then(response => setIsValidToken(response.data.isValid))
    .catch(error => console.log(error))
  }, []);

  return (
  <div className="App">
    <Routes>
      {isValidToken ? (
        <>
          <Route path='/home' element={<Homepage />} />
          <Route path='/song' element={<Songpage />} />
          <Route path="*" element={<Navigate to="/home" replace/>} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  </div>
  );
}

export default App;
