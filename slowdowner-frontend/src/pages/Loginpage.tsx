import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import Login from '../components/Login';
import Signup from '../components/Signup';

interface LoginProps {
    setToken: Function
}

const Loginpage: FC<LoginProps> = (setToken) => {


    return (
        <StyledLoginPage>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
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