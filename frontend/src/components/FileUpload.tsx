import React, { FC } from "react";
import { StyledButton } from "../styles/sharedStyles";
import styled from "styled-components";
import { SERVER_URL } from "../shared functions/constants";
import axios from "axios";

const FileUpload:FC = () => {


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()


    };

    return (
        <StyledFileUpload>
            <form onSubmit={handleSubmit}>
                <h1>Upload File Here</h1>
                <input type="file" />
                <StyledButton type="submit">Upload</StyledButton>
            </form>
        </StyledFileUpload>
    );
};

const StyledFileUpload = styled.div`

`;

export default FileUpload;