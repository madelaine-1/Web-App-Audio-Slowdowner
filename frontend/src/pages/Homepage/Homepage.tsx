import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import { StyledButton } from '../../styles/sharedStyles';
import FileUpload from './components/FileUpload';
import Sidebar from '../../components/Sidebar';
import File from './components/File';
import useServer from '../../Hooks/useServer';
import { Icon } from '@iconify/react';

type Song = {
    name: string,
    artist: string,
    id: number
}

const Homepage: FC = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [files, setFiles] = useState<Song[]>([]);
    const [uploadFile, setUploadFile] = useState<boolean>(false);
    const [sideBar, setSideBar] = useState<boolean>(false);

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
    }, [uploadFile]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <StyledHomepage>
            {sideBar && <Sidebar />}
            <div className='page-content'
                style={sideBar ? {"width": "83vw"} : {"width": "100vw"}}
            >
                <Icon 
                    className="side-bar-toggle"
                    icon="material-symbols:menu"
                    onClick={() => { setSideBar( !sideBar ) }} 
                />
                <div className='search-container'>
                    <input
                        className='search-box' 
                        type="text" 
                        value={searchInput}
                        placeholder={"Search"}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchInput(event.target.value)}
                    />
                    <StyledButton onClick={() => setUploadFile(true) }> 
                        <Icon 
                            icon="material-symbols:upload"
                        />
                    </StyledButton>
                </div>
                {uploadFile && <FileUpload setUploadFile={setUploadFile}/>}
                <div className='song-container'>
                    {files.length === 0 ? 
                        <div style={{"color": "white"}}>No available files</div> 
                        : 
                        files.map((file, index) => ((file.name.toLowerCase().includes(searchInput.toLowerCase()) || file.artist.toLowerCase().includes(searchInput.toLowerCase())) && <File key={index} filename={file.name} artist={file.artist} id={file.id} />))
                    }
                </div>
            </div>
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

.page-content {
    position: absolute;
    width: 50%;
    right: 0;
    height: 100vh;
    display: flex;
    flex-direction: row; 
    justify-content: center;

    .side-bar-toggle {
        background-color: none;
        position: absolute;
        color: white;
        font-size: 3em;
        left: 0;
        top: 0;
        padding: 5px;
        z-index: 500;
    }

    .search-container {
        position: absolute;
        top: 0;
        width: 87%;
        padding: 20px;
        display: flex;
        justify-content: space-between;

        .search-box {
            width: 85%;
            height: 4vh;
            border: none;
            border-radius: .5vh;
            padding-left: 2px;

            &:focus {
                border: none;
            }
        }

        button {
            height: 4vh;
            width: 8vw;
            font-size: 2em;
        }
    }

    .song-container {
        margin-top: 12vh;
        width: 90%;
        height: 85vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow-y: auto;
    }
}
`;



export default Homepage;