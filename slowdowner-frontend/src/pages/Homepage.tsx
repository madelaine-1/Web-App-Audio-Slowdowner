import React, { FC, useState, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { StyledButton } from '../styles/sharedStyles';
import Directory from '../components/Directory';
import File from '../components/File';

// const CLIENT_ID = "1726e00b548a4be2862335f14f754d0a";
// const CLIENT_SECRET = "69eef0a99bac4a718a115717b3be72ff";

const Homepage: FC = () => {
    const [accessToken, setAccessToken] = useState('');
    const [searchInput, setSearchInput] = useState<string>("");
    const [topDirectory, setTopDirectory] = useState<FileSystemDirectoryHandle | null>(null);
    const [children, setChildren] = useState<Array<FileSystemEntry> | null>(null);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                if (topDirectory) {
                    const entries = [];
                    for await (const entry of (topDirectory as any).values()) {
                        entries.push(entry);
                    }
                    setChildren(entries);
                }
            } catch (err) {
                console.error('Error fetching children:', err);
            }
        };
    
        fetchChildren();
    }, [topDirectory]);

    const selectDirectory = async () => {
        try {
            const directoryHandle = await (window as any).showDirectoryPicker();
            setTopDirectory(directoryHandle);
        } catch (err) {
            console.error('Error accessing file system:', err);
        }
    };

    return (
        <StyledHomepage>
            <StyledSearchBox>
                <StyledContentBox 
                    type="text" 
                    placeholder={"Search"}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchInput(event.target.value)}
                />
                <NewButton onClick={selectDirectory}>Select a Folder</NewButton>
            </StyledSearchBox>
            <StyledSongContainer>
                {children && children.map((entry: any) => entry.kind === 'file' ? <File file={entry}/> : <Directory directory={entry} />)}
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
    margin-top: 12vh;
    width: 70%;
    display: block;
`;

export default Homepage;