import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Login from '../components/Login';
import Signup from '../components/Signup';

interface LoginpageProps {
    setToken: Function
}

const Loginpage: FC<LoginpageProps> = ({ setToken }) => {


    return (
        <StyledLoginPage>
            <Routes>
                <Route path="/login" element={<Login setToken={setToken}/>}></Route>
                <Route path="/signup" element={<Signup setToken={setToken}/>}></Route>
            </Routes>
        </StyledLoginPage>
    );
}

const StyledLoginPage = styled.div`
    background-color: darkblue;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default Loginpage;