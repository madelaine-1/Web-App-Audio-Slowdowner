import React, { FC, useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { StyledButton } from '../styles/sharedStyles';
import FileUpload from '../components/FileUpload';
import axios from 'axios';
import { SERVER_URL } from '../shared functions/constants';
import Cookies from 'js-cookie';
// import Directory from '../components/Directory';
// import File from '../components/File';

const Homepage: FC = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    //const [topDirectory, setTopDirectory] = useState<FileSystemDirectoryHandle | null>(null);
    //const [children, setChildren] = useState<Array<FileSystemEntry> | null>(null);

    // useEffect(() => {
    //     const fetchChildren = async () => {
    //         try {
    //             if (topDirectory) {
    //                 const entries = [];
    //                 for await (const entry of (topDirectory as any).values()) {
    //                     entries.push(entry);
    //                 }
    //                 setChildren(entries);
    //             }
    //         } catch (err) {
    //             console.error('Error fetching children:', err);
    //         }
    //     };
    
    //     fetchChildren();
    // }, [topDirectory]);

    const selectDirectory = async () => {
        
    };

    const handleUpload = async () => {
        axios.get(`${SERVER_URL}/users/current`, {
            headers: {
                'Authorization': `Bearer ${Cookies.get("token")}`
            }
        })
        .then(res => {
            console.log(res);
            console.log(res.data);
        })
        .catch(error => {
            console.log(error);
        });
    };

    return (
        <StyledHomepage>
            <StyledSearchBox>
                <StyledContentBox 
                    type="text" 
                    placeholder={"Search"}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchInput(event.target.value)}
                />
                <NewButton onClick={handleUpload}>Select a Folder</NewButton>
            </StyledSearchBox>
            <FileUpload></FileUpload>
            <StyledSongContainer>

            </StyledSongContainer>
        </StyledHomepage>
    );
}

const StyledHomepage = styled.div`
    background-color: darkblue;
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row; 
    justify-content: center;
`;

const StyledSearchBox = styled.div`
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
    margin-top: 12vh;
    width: 70%;
    display: block;
`;

export default Homepage;