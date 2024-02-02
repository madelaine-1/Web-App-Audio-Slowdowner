import React, { FC,useState } from "react";
import { useNavigate } from 'react-router-dom';
import { StyledButton, StyledForm } from '../styles/sharedStyles';
import useServer from "../Hooks/useServer";

const Signup: FC = () => {
    const navigate = useNavigate();

    // user inputs
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [verifyPassword, setVerifyPassword] = useState<string>("");

    // error verification
    const [passwordIncorrect, setPasswordIncorrect] = useState<boolean>(false);
    const [invalidEmail, setInvalidEmail] = useState<boolean>(false);

    const {fetchData} = useServer(
        "users/", 
        "POST", 
        null, 
        (response) => {
            console.log(response.data);
            navigate('/login');
        }, 
        (error) => {
            console.log(error);
        } );


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if(!verifyUserInput()) { return }

        let data = {
            username: username,
            email: email,
            password: password
        }

        await fetchData(data);
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
        <StyledForm onSubmit={handleSubmit}>
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
        </StyledForm>
    );
};

export default Signup;