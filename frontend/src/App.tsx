import './App.css';
import React, { useState, useEffect } from 'react';
import Homepage from './pages/Homepage/Homepage';
import Songpage from './pages/Songpage/Songpage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useServer from './Hooks/useServer';

function App() {
  const navigate = useNavigate();

  const [isValidToken, setIsValidToken] = useState<boolean>(false);


  const { fetchData } = useServer(
    "users/validate-token", 
    "POST", 
    Cookies.get("token"), 
    (response) => {
      console.log(response);
      setIsValidToken(response.isValid);
    }, 
    (error) => {
      console.log(error);
      setIsValidToken(false);
      navigate("/login")
    });

    useEffect(() => {
      if (Cookies.get("token")) {
        fetchData(Cookies.get("token"));
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
