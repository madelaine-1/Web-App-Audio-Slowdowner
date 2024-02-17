import React, { FC, useState, useRef } from 'react';
import styled from 'styled-components';
import { StyledButton } from '../../../styles/sharedStyles';
import { formatTime } from '../../../shared functions/sharedFunctions';
import { Music } from '../Music';

interface LooperProps {
    player: Music;
}

const LooperControls:FC<LooperProps> = ({player}) => {
    /* State values:
        loopStart: time in seconds that loop should end 
        loopEnd: time in seconds that loop should end 
    */
    const [loopStart, setLoopStart] = useState(0);
    const [loopEnd, setLoopEnd] = useState(player.length);
    const [isLooping, setIsLooping] = useState(false);

    /* References to the HTML tags for the sliders */
    const startInputRef = useRef<HTMLInputElement>(null);
    const endInputRef = useRef<HTMLInputElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    /******************/
    /* EVENT HANDLERS */
    /******************/

    /* Function that handles changes in the start value of the loop */
    const handleStartChange = () => {
        const newStart = parseInt(startInputRef.current?.value || '0', 10);
        let newEnd = parseInt(endInputRef.current?.value || '0', 10);

        if (newStart >= newEnd) newEnd = newStart + 1;

        setLoopStart(newStart);
        setLoopEnd(newEnd);
        // player.setLoopPoints(loopStart, loopEnd);
    }

    /* Function that handles changes in the end value of the loop */
    const handleEndChange = () => {
        var newStart = parseInt(startInputRef.current?.value || '0', 10);
        const newEnd = parseInt(endInputRef.current?.value || '0', 10);

        if (newEnd <= newStart) newStart = newEnd - 1;

        setLoopStart(newStart);
        setLoopEnd(newEnd);
    }

    const toggleLooping = async () => {
        await setIsLooping(!isLooping);
        // player.loopStart = await loopStart;
        // player.loopEnd = await loopEnd;
        // player.loop = isLooping;
        // console.log(`Is looping?: ${player.loop}`);
    };

    return (
        <div className="loop-controller-box">
            {/* Loop title */}
            <StyledTitleBox>
                <div className="title">Looper</div>
            </StyledTitleBox>
            {/* Double slider */}
            <StyledSliderContainer ref={sliderRef}>
                <StyledSlider 
                    type="range" 
                    min="0" 
                    max={player.length} 
                    value={loopStart} 
                    ref={startInputRef}
                    onChange={handleStartChange}
                />
                <StyledSlider 
                    type="range" 
                    min="0" 
                    max={player.length} 
                    value={loopEnd} 
                    ref={endInputRef}
                    onChange={handleEndChange} 
                />
            </StyledSliderContainer>
            {/* Display of start and end time of loop */}
            <StyledIndexBox>
                <div>{formatTime(loopStart)}</div>
                <div>{formatTime(loopEnd)}</div>
            </StyledIndexBox>
            <StyledButtonContainer>
                <StyledButton onClick={toggleLooping}>Saved Loops</StyledButton>
                <StyledButton onClick={toggleLooping}>Toggle looping</StyledButton>
            </StyledButtonContainer>
        </div>
    );
};

export default LooperControls;

/***************/
/* CSS Styling */
/***************/
const StyledTitleBox = styled.div`
    color: white;
    font-weight: bolder;
`;

const StyledSliderContainer = styled.div`
    position: relative;
    width: 100%;
`;

const StyledSlider = styled.input`
    position: absolute;
    box-sizing: border-box;
    appearance: none;
    width: 100%;
    margin: none;
    padding: 0 2px;
    overflow: hidden;
    border: 0;
    border-radius: 1px;
    outline: none;
    background: linear-gradient(grey, grey) no-repeat center;
    background-size: 100% 4px;
    pointer-events: none;

    &::-webkit-slider-thumb {
        pointer-events: all;
    }

    &:nth-child(2) {
        background: none;
    }
`;

const StyledIndexBox = styled.div`
    display: flex;
    justify-content: space-between;
    color: white;
    padding-top: 1.5em;
`;

const StyledButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    margin: 0;
    width:100%
`;