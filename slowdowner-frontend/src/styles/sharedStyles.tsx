import styled from 'styled-components';

export const StyledButton = styled.button`
    background-color: blue;
    height: 8vh;
    width: 10vw;
    border: none;
    border-radius: 2vh;
    color: white;
    font-weight: bolder;
    transition-duration: 250ms;

    &:hover {
        background-color: rgb(0,0,200);
        border: none;
        border-radius: 2vh;
        color: white;
        font-weight: bolder;
    }
`;

export const StyledSlider = styled.input`
    width: 100%;
    appearance: none;
    margin: none;
    padding: 0 2px;
    overflow: hidden;
    background: linear-gradient(grey, grey) no-repeat center;
    background-size: 100% 4px;
`;

export const StyledSliderIndexBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: white;
`;