import React, { useState, useRef, useEffect, FC } from 'react';
import Slider from '../components/Slider'
import MediaControls from '../components/MediaControls'
import LooperControls from '../components/LooperControls';
import { ToneAudioBuffer, GrainPlayer } from 'tone';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SERVER_URL } from '../shared functions/constants';
import Cookies from 'js-cookie';

const Songpage: FC = () => {
    // props
    const location = useLocation();
    const {name, artist, id} = location.state;

    // States
    const [player, setPlayer] = useState<GrainPlayer>(new GrainPlayer());
    const buffer = useRef<ToneAudioBuffer>(new ToneAudioBuffer());




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

            if (buffer.current) {
                buffer.current.dispose();
                player.disconnect();
            }
    
            console.log('Loading buffer');
            const audioBuffer = await getAudioBuffer();
            const newBuffer = new ToneAudioBuffer(audioBuffer);
            console.log('Buffer loaded');
            
            const newPlayer = new GrainPlayer(newBuffer).toDestination();
            buffer.current = newBuffer;
            setPlayer(newPlayer);
            console.log('Player created');
        } catch (error) {
            console.error(`Error initializing player: ${error}`);
            throw error;
        }
        };
    
        initializePlayer();

        return () => {
            console.log("cleaning up...");
            isMounted = false; // Mark the component as unmounted
            if (buffer.current) {
              buffer.current.dispose();
            }
            if (!player.disposed) {
              player.disconnect();
              player.dispose();
            }
          };
    }, [id]);

    const handlePitchChange = (cents: number) => {
        player.detune = cents * 100;
    };

    const handleSpeedChange = (speed: number) => {

    };

    const handleVolumeChange = (percentage: number) => {
        player.volume.value = (1 - (percentage / 100)) * (-60);
        console.log('Linear Volume:', player.volume.value);
    };

    return (
        <StyledSongPage className="App">
            <LooperControlsContainer>
                <LooperControls 
                    songLength={buffer.current.duration}
                    player={player}
                />
            </LooperControlsContainer>
            <SliderContainer>
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
                    onChange={handlePitchChange}
                />
                <Slider
                    title={"Volume"} 
                    value={50}
                    min={0}
                    max={100}
                    step={1}
                    onChange={handleVolumeChange}
                />
            </SliderContainer>
            <MediaControlsContainer>
                <MediaControls 
                    player={player}
                    songLength={buffer.current.duration}
                />
            </MediaControlsContainer>
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
`;

const LooperControlsContainer = styled.div`
    width: 80%;
`;

const SliderContainer = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 40%;
`;

const MediaControlsContainer = styled.div`
    width:80%;
`;