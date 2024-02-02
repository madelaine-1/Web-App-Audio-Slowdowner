import React, { FC, useState } from "react";
import { StyledButton } from "../../../styles/sharedStyles";
import styled from "styled-components";
import { StyledForm } from "../../../styles/sharedStyles";
import useServer from "../../../Hooks/useServer";
interface FileUploadProps {
    setUploadFile: Function
}

const FileUpload:FC<FileUploadProps> = ({setUploadFile}) => {
    const [name, setName] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    const {fetchData} = useServer(
            "songs/", 
            "POST", 
            null,
            () => setUploadFile(false),
            (error) => console.log(error)
        );



    // uploads a new file to the server
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("song_name", name);
        formData.append("artist_name", artist)
        if (file) {
            formData.append('file', file);
        } else {
            return;
        }

        await fetchData(formData);
    };

    return (
        <StyledUploadPage>
            <StyledForm onSubmit={handleSubmit}>
                <h1>Upload File Here</h1>
                <label>
                    <input 
                        type="text"
                        name="name"
                        placeholder="Enter the name of the song"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                </label>
                <label>
                    <input 
                        type="text"
                        name="artist"
                        placeholder="Enter the name of the artist"
                        value={artist}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
                    />
                </label>
                <label>
                    <StyledFileUpload 
                        type="file"
                        name="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null)}
                    />
                </label>

                <StyledButton type="submit">Upload</StyledButton>
            </StyledForm>

            <StyledExitButton onClick={() => setUploadFile(false) }>x</StyledExitButton>
        </StyledUploadPage>
    );
};

const StyledUploadPage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const StyledFileUpload = styled.input`
    background-color: blue;
    height: 8vh;
    width: 10vw;
    border: none;
    border-radius: 2vh;
    color: white;
    font-weight: bolder;
    transition-duration: 250ms;

    &:hover {
        background-color: rgb(0,0,200);
        border: none;
        border-radius: 2vh;
        color: white;
        font-weight: bolder;
    }
`;

const StyledExitButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;

    font-size: 50px;
    color: white;
    background-color: transparent;
    border: none;
    transition: color 0.3s ease-in-out;

    &:hover {
        color: #AAA;
    }
`;

export default FileUpload;