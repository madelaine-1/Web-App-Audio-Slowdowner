import React, { FC, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { StyledButton, StyledLoginContainer } from '../styles/sharedStyles';
import { SERVER_URL } from "../shared functions/constants";

interface LoginProps {
    setToken: Function
}

const Login: FC<LoginProps> = ({ setToken }) => {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordIncorrect, setPasswordIncorrect] = useState<boolean>(false)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
    
        axios({
            method: 'post',
            url: `${SERVER_URL}/users/token/`, 
            data: formData,
            
        })
            .then(res => {
                console.log(res.data);
                setToken(res.data.access_token);
                navigate('/home');
            })
            .catch(error => {
                console.error(error);
            }
        );
    };

    return (
        <StyledLoginContainer onSubmit={handleSubmit}>
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
        </StyledLoginContainer>
    );
};

export default Login;