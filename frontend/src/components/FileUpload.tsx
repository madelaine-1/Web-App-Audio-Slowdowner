import React, { FC, useState } from "react";
import { StyledButton } from "../styles/sharedStyles";
import styled from "styled-components";
import { SERVER_URL } from "../shared functions/constants";
import axios from "axios";
import Cookies from "js-cookie";

const FileUpload:FC = () => {
    const [name, setName] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);


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

        axios({
            method: 'post',
            url: `${SERVER_URL}/songs/`,
            data: formData,
            headers: {
                'Authorization': `Bearer ${Cookies.get("token")}`,
                'Content-Type': 'multipart/form-data'
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
        <StyledFileUpload>
            <form onSubmit={handleSubmit}>
                <h1>Upload File Here</h1>
                <input 
                    type="text"
                    placeholder="Enter the name of the song"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Enter the name of the artist"
                    value={artist}
                    onChange={e => setArtist(e.target.value)}
                />
                <input 
                    type="file"
                    onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                />
                <StyledButton type="submit">Upload</StyledButton>
            </form>
        </StyledFileUpload>
    );
};

const StyledFileUpload = styled.div`

`;

export default FileUpload;