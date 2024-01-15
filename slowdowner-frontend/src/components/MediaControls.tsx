import { FC, useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { GrainPlayer } from 'tone';
import * as Tone from 'tone';
import styled from 'styled-components';
import { StyledButton, StyledSlider, StyledSliderIndexBox } from '../styles/sharedStyles';
import { formatTime } from '../shared functions/sharedFunctions';

interface MediaControlsProps {
  player: GrainPlayer;
  songLength: number;
}

const MediaControls: FC<MediaControlsProps> = ({ player, songLength }) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime((prevTime) => Math.min(prevTime + 0.5, songLength));
      }, 500);
    }

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [isPlaying, songLength]);

  const handlePause = () => {
    if (!hasStarted) {
      Tone.start();
      setHasStarted(true);
    }

    if (player.loaded) {
      if (player.state === 'stopped') {
        player.start(undefined, currentTime);
        setIsPlaying(true);
      } else {
        player.stop();
        setIsPlaying(false);
      }
    } else {
      console.log('Error: no buffer associated with player or buffer not loaded');
    }
  };

  const handleSkipBackward = async () => {
    await setCurrentTime(Math.max(0, currentTime - 5));
    if (isPlaying) {
      await player.stop();
      player.start(undefined, currentTime);
    };
  };

  const handleSkipForward = async () => {
    await setCurrentTime(Math.min(currentTime + 5, songLength));
    if (isPlaying) {
      await player.stop();
      player.start(undefined, currentTime);
    };
  };

  const handleRestart = async () => {
    await setCurrentTime(0);
    await player.stop();
    player.start(undefined, 0);
  };

  const handleSpacebarPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      handlePause();
    }
  };

  const handleSliderChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!hasStarted) {
      Tone.start();
      setHasStarted(true);
    }
    await setCurrentTime(parseFloat(event.target.value));
    if (isPlaying) {
      await player.stop();
      player.start(undefined, parseFloat(event.target.value));
    }
  };

  return (
    <StyledMediaControls onKeyDown={handleSpacebarPress}>
      <StyledTitle>{formatTime(currentTime)}</StyledTitle>
      <StyledSlider 
        type="range"
        value={currentTime}
        min={0}
        max={songLength}
        step={.5}
        onChange={handleSliderChange}
      />
      <StyledSliderIndexBox>
        <div>{"0:00"}</div>
        <div>{formatTime(songLength)}</div>
      </StyledSliderIndexBox>
      <StyledButtonContainer>
        <StyledButton onClick={handleRestart}>Restart</StyledButton>
        <StyledButton onClick={handleSkipBackward}>Skip Back</StyledButton>
        <StyledButton onClick={handlePause} onKeyPress={event => {

        }}>Pause</StyledButton>
        <StyledButton onClick={handleSkipForward}>Skip Forward</StyledButton>
      </StyledButtonContainer>
    </StyledMediaControls>
  );
};
  
  export default MediaControls;

/***************/
/* CSS Styling */
/***************/
const StyledMediaControls = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledTitle = styled.div`
  color: whitesmoke;
  width: 100%;
  justify-self: start;
`;

const StyledButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;