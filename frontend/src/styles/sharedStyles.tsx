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

export const StyledForm = styled.form`
    background-color: white;
    height: 75vh;
    width: 35vw;
    border-radius: 2vw;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    h1 {
        height: 10%;
    }

    label { 
        height: 25%;
        width: 80%;
        display: grid;
        align-items: start;
        justify-items: center;
        grid-template-rows: auto auto auto 1fr; 

        p {
            justify-self: left;
            align-self: flex-start;
            margin: 0; 
            flex-grow: 1;
        }

        input {
            height: 2vh;
            width: 100%;
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
        }
        
        input:focus {
            border-color: #66afe9;
            outline: 0;
            box-shadow: inset 0 1px 3px rgba(0,0,0,.1), 0 0 8px rgba(102, 175, 233, .6);
        }
    }
`;
