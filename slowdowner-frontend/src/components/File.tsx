import React, { FC, useState } from 'react';
import styled from 'styled-components';

interface FileProps {
    file: FileSystemHandle;
};

const File:FC<FileProps> = ({ file }) => {
    const handleOpenFile = () => {

    };

    return (
        <StyledDirectory onClick={handleOpenFile}>
            <div>{file.name}</div>
            <div>🎵</div>
        </StyledDirectory>
    );
};

const StyledDirectory = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: red;
`;

export default File;