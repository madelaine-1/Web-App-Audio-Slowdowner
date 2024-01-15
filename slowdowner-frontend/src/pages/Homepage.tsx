import { FC, useState, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { StyledButton } from '../styles/sharedStyles';

const CLIENT_ID = "1726e00b548a4be2862335f14f754d0a";
const CLIENT_SECRET = "69eef0a99bac4a718a115717b3be72ff";

const Homepage: FC = () => {
    const [accessToken, setAccessToken] = useState('');
    const [searchInput, setSearchInput] = useState<string>("");

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                // API access token
                const authParameters = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
                };

                const response = await fetch("https://accounts.spotify.com/api/token", authParameters);
                const data = await response.json();

                setAccessToken(data.access_token);
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        };

        fetchAccessToken();
    }, []);

    const handleSubmit = () => {};

    return (
        <StyledHomepage>
            <StyledSearchBox onSubmit={handleSubmit}>
                <StyledContentBox 
                    type="text" 
                    placeholder={"Search"}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchInput(event.target.value)}
                />
                <NewButton type="submit">Search</NewButton>
            </StyledSearchBox>
            <StyledSongContainer></StyledSongContainer>
        </StyledHomepage>
    );
}

const StyledHomepage = styled.div`
    background-color: darkblue;
    height: 300vh;
    width: 100vw;
`;

const StyledSearchBox = styled.form`
    background-color: green;
    position: fixed;
    top: 0;
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-around;
`;

const StyledContentBox = styled.input`
    width: 80%;
    height: 4vh;
    border: none;
    border-radius: .5vh;
    padding-left: 2px;

    &:focus {
        border: none;
    }
`;

const NewButton = styled(StyledButton)`
    height: 4vh;
`;

const StyledSongContainer = styled.div`
    margin-top: 7%;
    width: 100%;
    display: grid;
    
`;

export default Homepage;