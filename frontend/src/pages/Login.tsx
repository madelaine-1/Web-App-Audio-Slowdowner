import React, { FC, useState } from "react";
import { StyledButton, StyledForm } from '../styles/sharedStyles';
import { getUserToken } from "../shared functions/sharedFunctions";

const Login: FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordIncorrect, setPasswordIncorrect] = useState<boolean>(false);

    // Logs user in and gives
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        setPasswordIncorrect(await getUserToken(username, password));
    };

    return (
        <StyledForm onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label>
                <p>Username</p>
                <input 
                    type="text" 
                    placeholder="Enter your username or email" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
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
                {passwordIncorrect && <h5>Password or username is incorrect</h5>}
            </label>

            <StyledButton type="submit">Submit</StyledButton>
        </StyledForm>
    );
};

export default Login;