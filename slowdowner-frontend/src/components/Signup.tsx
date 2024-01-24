import React, { FC,useState } from "react";
import axios from "axios";

import { StyledButton, StyledLoginContainer } from '../styles/sharedStyles';
import { SERVER_URL } from "../shared functions/constants";

const Signup: FC = () => {
    // user inputs
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [verifyPassword, setVerifyPassword] = useState<string>("");

    // error verification
    const [passwordIncorrect, setPasswordIncorrect] = useState<boolean>(false);
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!verifyUserInput()) { return }

        axios.post(SERVER_URL+"/users/", {username, email, password})
        .then(res => {
            console.log(res);
            console.log(res.data);
        })
    };

    const verifyUserInput = (): boolean => {
        let isValid = true;
        if(password !== verifyPassword) {
            setPasswordIncorrect(true);
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setInvalidEmail(true);
            isValid = false;
        }
        return isValid;
    };

    return (
        <StyledLoginContainer onSubmit={handleSubmit}>
            <h1>Sign up</h1>
            <label>
                <p>Username</p>
                <input 
                    type="text" 
                    placeholder="Enter your username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
            </label>
            <label>
                <p>Email</p>
                <input 
                    style={{ borderColor: invalidEmail ? 'red' : "#ccc" }}
                    type="text" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}  
                />
                {invalidEmail && <h5>Please enter a valid email</h5>}
            </label>
            <label>
                    <p>Password</p>
                    <input
                        style={{ borderColor: passwordIncorrect ? 'red' : "#ccc" }}
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)} 
                    />

            </label> 
            <label>
                <p>Re-enter Password</p>
                <input 
                    style={{ borderColor: passwordIncorrect ? 'red' : "#ccc" }}
                    type="password" 
                    placeholder="Re-enter your password" 
                    value={verifyPassword}
                    onChange={e => setVerifyPassword(e.target.value)} 
                />
                {passwordIncorrect && <h5>Passwords do not match</h5>}
            </label>


            <StyledButton type="submit">Submit</StyledButton>
        </StyledLoginContainer>
    );
};

export default Signup;