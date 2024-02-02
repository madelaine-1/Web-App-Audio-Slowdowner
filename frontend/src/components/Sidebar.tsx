import React, { FC } from 'react';
import styled from 'styled-components';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Sidebar: FC = () => {
    const navigate = useNavigate();


    const signOut = () => {
        console.log("Signing out");
        Cookies.remove("token");
        navigate("/login")
    };

    return (
        <StyledSidebar>
            <div className='logo-container'>Logo</div>
            <div className='button-container'>
                <div onClick={() => navigate("/home")}>Home</div>
                <div onClick={signOut}>Sign out</div>
                <div>Report a bug</div>
                <div>About</div>
            </div>
        </StyledSidebar>
    );
};

const StyledSidebar = styled.div`
    height: 100vh;
    width: 15vw;
    background-color: blue;
    position: fixed;
    left: 0;
    top: 0;
    padding: 1em;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1000;

    div {
        width: 100%;
        margin: .2em;
        color: white;
    }

    .logo-container {
        font-size: 2.2em;
        font-weight: bolder;
    }

    .button-container {
        font-weight: bold;
        font-size: 1.5em;
    }
`;

export default Sidebar;