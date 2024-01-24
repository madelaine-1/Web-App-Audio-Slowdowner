import React, { FC } from "react";

import { StyledButton, StyledLoginContainer } from '../styles/sharedStyles';
import { SERVER_URL } from "../shared functions/constants";

const Login: FC = () => {


    return (
        <StyledLoginContainer>
            <h1>Login</h1>
            <label>
                <p>Username</p>
                <input type="text" placeholder="Enter your username or email" />
            </label>
            <label>
                <p>Password</p>
                <input type="password" placeholder="Enter your password" />
            </label>

            <StyledButton type="submit">Submit</StyledButton>
        </StyledLoginContainer>
    );
};

export default Login;