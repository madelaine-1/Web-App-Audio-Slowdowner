import {FC, ChangeEvent, useState, useEffect} from 'react';
import { StyledSlider, StyledSliderIndexBox } from '../styles/sharedStyles';
import styled from 'styled-components';

interface SliderProps {
    title?: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}

const Slider: FC<SliderProps> = ({ title="", value, min, max, step, onChange }) => {
    const [localValue, setLocalValue] = useState<number>(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(event.target.value);
        setLocalValue(newValue);
        onChange(newValue);
    }

    return (
        <StyledSliderBox className="slider">
            <StyledTitleBox>
                <div>{title}</div>
                <div>{localValue}</div>
            </StyledTitleBox>
            <StyledSlider type="range"
                value={localValue}
                min={min}
                max={max}
                step={step}
                onChange={handleSliderChange}
            />
            <StyledSliderIndexBox>
                <div>{min}</div>
                <div>{(max+min)/2}</div>
                <div>{max}</div>
            </StyledSliderIndexBox>
        </StyledSliderBox>
    );
};

export default Slider;

/***************/
/* CSS Styling */
/***************/
const StyledSliderBox = styled.div`
    width: 100%;
`;

const StyledTitleBox = styled.div`
    color: whitesmoke;
    padding-bottom: .5vh;
    display:flex;
    justify-content: space-between;
`;