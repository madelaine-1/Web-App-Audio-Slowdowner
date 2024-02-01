import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import { StyledButton } from '../styles/sharedStyles';
import FileUpload from '../components/FileUpload';
import axios from 'axios';
import { SERVER_URL } from '../shared functions/constants';
import Cookies from 'js-cookie';
import File from '../components/File';
import useServer from '../Hooks/useServer';

type Song = {
    name: string,
    artist: string,
    id: number
}

const Homepage: FC = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [files, setFiles] = useState<Song[]>([]);
    const [uploadFile, setUploadFile] = useState<boolean>(false);

    const {fetchData} = useServer(
        "songs/", 
        "GET", 
        null,
        (response) => { 
            if(Array.isArray(response)) {
                setFiles(response); 
            }
        },
        (error) => { console.log(error) }
        );

    useEffect(() => {
        if(!uploadFile) {
            fetchData(null);
        }
    }, [uploadFile]);

    return (
        <StyledHomepage>
            <StyledSearchBox>
                <StyledContentBox 
                    type="text" 
                    value={searchInput}
                    placeholder={"Search"}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchInput(event.target.value)}
                />
                <StyledButton onClick={() => setUploadFile(true) }> Upload File</StyledButton>
            </StyledSearchBox>
            {uploadFile && <FileUpload setUploadFile={setUploadFile}/>}
            <StyledSongContainer>
                {files.map((file, index) => (<File key={index} filename={file.name} artist={file.artist} id={file.id} />))}
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