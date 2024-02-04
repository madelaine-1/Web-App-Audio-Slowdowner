import React, { useState, useEffect, FC } from 'react';
import Slider from './components/Slider'
import MediaControls from './components/MediaControls'
import LooperControls from './components/LooperControls';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../../shared functions/constants';
import Cookies from 'js-cookie';
import { ToneJS } from './Music';
import Sidebar from '../../components/Sidebar';
import { Icon } from '@iconify/react';

const Songpage: FC = () => {
    // props
    const location = useLocation();
    const {name, artist, id} = location.state;

    // States
    const [player, setPlayer] = useState<ToneJS | null>(null);
    const [sideBar, setSideBar] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        const getAudioBuffer = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: `${SERVER_URL}/songs/${id}`,
                    headers: {
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    },
                    responseType: "arraybuffer"
                });
        
                const arrayBuffer = response.data;
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
                try {
                    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                    return audioBuffer;
                } catch (error) {
                console.error('Error decoding audio data:', error);
                throw error;
                } finally {
                audioContext.close();
                }
            } catch (error) {
                console.error('Error fetching audio file:', error);
                throw error;
            }
        };
    
        const initializePlayer = async () => {
        try {
            if (!isMounted) {
                return
            }

            const audioBuffer = await getAudioBuffer();
            const player = new ToneJS(audioBuffer);

            setPlayer(player);
            } catch (error) {
                console.error(`Error initializing player: ${error}`);
                throw error;
            }
        };
    
        initializePlayer();

        return () => {
            player?.cleanUp();
          };
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps


    const handleSpeedChange = (speed: number) => {

    };

    return (
        <StyledSongPage className="App">
            {player instanceof ToneJS ? (
                <>
                    {sideBar && <Sidebar />}
                    <div 
                        className='page-content'
                        style={sideBar ? {"width": "83vw"} : {"width": "100vw"}}
                    >
                        {sideBar && <Sidebar />}
                        <Icon 
                            className="side-bar-toggle"
                            icon="material-symbols:menu"
                            onClick={() => { setSideBar( !sideBar ) }} 
                        />
                        <div className='title-container'>
                            <h1>{name}</h1>
                            <h3>{artist}</h3>
                        </div>
                        <div className='looper-container'>
                            <LooperControls 
                                player={player}
                            />
                        </div>
                        <div className='slider-container'>
                            <Slider
                                title={"Speed"} 
                                value={0}
                                min={-100}
                                max={100}
                                step={1}
                                onChange={handleSpeedChange}
                            />
                            <Slider
                                title={"Pitch"} 
                                value={0}
                                min={-50}
                                max={50}
                                step={1}
                                onChange={value => player?.changePitch(value)}
                            />
                            <Slider
                                title={"Volume"} 
                                value={50}
                                min={0}
                                max={100}
                                step={1}
                                onChange={value =>  player?.changeVolume(value)}
                            />
                        </div>
                        <div className='media-controls-container'>
                            <MediaControls 
                                player={player}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <h1 style={{"color": "white"}}>Loading...</h1>
            )}
        </StyledSongPage>
    );
}

export default Songpage;

/***************/
/* CSS Styling */
/***************/
const StyledSongPage = styled.div`
    background-color: darkblue;
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    justify-content: space-around;

    .page-content {
        position: absolute;
        width: 50%;
        right: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

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
    
        .title-container {
            color: white;
            text-align: center;
            height: 10%;
        }
    
        .looper-container {
            width: 80%;
        }
    
        .slider-container {
            width: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 40%;
        }
    
        .media-controls-container {
            width:80%;
        }
    }
`;