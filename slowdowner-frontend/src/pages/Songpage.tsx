import React, { useState, useRef, useEffect, FC } from 'react';
import Slider from '../components/Slider'
import MediaControls from '../components/MediaControls'
import LooperControls from '../components/LooperControls';
import { ToneAudioBuffer, GrainPlayer } from 'tone';
import styled from 'styled-components';

const songUrl = './Tigran-Hamasyan-Blues-in-the-Closet.mp3';

const Songpage: FC = () => {
    // States
    const [player, setPlayer] = useState<GrainPlayer>(new GrainPlayer());
    const buffer = useRef<ToneAudioBuffer>(new ToneAudioBuffer());


    useEffect(() => {
        const getAudioFile = async () => {
            try {
                buffer.current.dispose();
                player.disconnect();
                console.log('Loading buffer');
                const newBuffer = await ToneAudioBuffer.fromUrl(songUrl);
                console.log('Buffer loaded');
                const newPlayer = new GrainPlayer(newBuffer).toDestination();
                buffer.current = newBuffer;
                setPlayer(newPlayer);
                console.log('Player created');
            } catch (error) {
                buffer.current.dispose();
                player.disconnect();
                console.error(`Error getting audio file: ${error}`);
                throw error;
            }
        };
    
        getAudioFile();
    }, []);

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