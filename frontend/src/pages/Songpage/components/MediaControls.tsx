import React, { FC, ChangeEvent, KeyboardEvent, useState, useEffect } from 'react';
import styled from 'styled-components';
import { StyledButton, StyledSlider, StyledSliderIndexBox } from '../../../styles/sharedStyles';
import { formatTime } from '../../../shared functions/sharedFunctions';
import { ToneJS } from '../Music';
import { Icon } from '@iconify/react';

interface MediaControlsProps {
  player: ToneJS;
}

const MediaControls: FC<MediaControlsProps> = ({ player }) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (player) {
                setCurrentTime(player.currentTime);
            }
        }, 500);
    
        // Clear interval on cleanup
        return () => clearInterval(interval);
    }, [player]);

  const handleSpacebarPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      player.pausePlay();
    }
  };

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    player.skipTo(parseFloat(event.target.value));
  };

  return (
    <StyledMediaControls onKeyDown={handleSpacebarPress}>
      <StyledTitle>{formatTime(player.currentTime)}</StyledTitle>
      <StyledSlider 
        type="range"
        value={currentTime}
        min={0}
        max={player.length}
        step={.5}
        onChange={handleSliderChange}
      />
      <StyledSliderIndexBox>
        <div>{"0:00"}</div>
        <div>{formatTime(player.length)}</div>
      </StyledSliderIndexBox>
      <StyledButtonContainer>
        <StyledButton onClick={() => player.skipTo(0)}>
        <Icon
            icon="iconamoon:restart-bold"
          />
        </StyledButton>
        <StyledButton onClick={() => player.skipTo(player.currentTime - 5)}>
        <Icon
            icon="ph:skip-back-fill"
          />
        </StyledButton>
        <StyledButton onClick={player.pausePlay}>
          <Icon 
            icon="ph:play-fill"
          />
        </StyledButton>
        <StyledButton onClick={() => player.skipTo(player.currentTime + 5)}>
          <Icon
            icon="ph:skip-forward-fill"
          />
        </StyledButton>
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

  button {
    font-size: 2em;
  }
`;