import React, { FC } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface FileProps {
    filename: string
    artist: string
    id: number
}

declare global {
    interface Window { webkitAudioContext: typeof AudioContext }
}

const File: FC<FileProps> = ({ filename, artist, id }) => {
    const navigate = useNavigate();

    const handleOpenFile = () => {
        navigate('/song', {
            state: { 
                name: filename, 
                artist: artist, 
                id: id
            } 
        });          
    };

    return(
        <StyledFile onClick={handleOpenFile}>
            <div>{filename}</div>
            <div>{artist}</div>
        </StyledFile>
    );
};

const StyledFile = styled.div`
    width: 100%;
    height: 2vh;
    display: flex;
    margin-bottom: 1vh;
    padding: 1vh;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: blue;
    color: white;
    font-weight: bold;
`;

export default File;