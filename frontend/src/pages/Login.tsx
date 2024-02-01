import React, { FC, useState, useEffect } from "react";
import { StyledButton, StyledForm } from '../styles/sharedStyles';
import useServer from "../Hooks/useServer";
import Cookies from "js-cookie";

const Login: FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordIncorrect, setPasswordIncorrect] = useState<boolean>(false);

    const {response, isLoading, error, fetchData} = useServer(
        "users/token", 
        "POST",
        null,
        (response) => {
            console.log(response);
            Cookies.set('token', response.access_token);
            window.location.reload();
        },
        (error) => {
            console.log(error);
            setPasswordIncorrect(true);
        }
        );

    // Logs user in and gives
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        await fetchData(formData);
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