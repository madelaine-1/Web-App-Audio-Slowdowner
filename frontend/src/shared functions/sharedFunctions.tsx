import axios from "axios";
import Cookies from "js-cookie";
import { SERVER_URL } from "./constants";

export const formatTime = (timeInSeconds:number):string => {
    const seconds = Math.floor(timeInSeconds % 60);

    const minutes = Math.floor(timeInSeconds / 60);
    return `${minutes}:${seconds >= 10 ? seconds: "0" + seconds}`;
}

export const getUserToken = async (username: string, password: string) => {
    let passwordIncorrect = false

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    axios({
        method: 'post',
        url: `${SERVER_URL}/users/token/`, 
        data: formData,
    })
    .then(res => {
        console.log(res.data);
        Cookies.set('token', res.data.access_token);
        window.location.reload();
    })
    .catch(error => {
        console.error(error);
        passwordIncorrect = true;
    });

    return passwordIncorrect;
};

export const uploadFile = async (name: string, artist: string, file: File | null) => {
    const formData = new FormData();
    formData.append("song_name", name);
    formData.append("artist_name", artist)
    if (file) {
        formData.append('file', file);
    } else {
        return 1;
    }

    axios({
        method: 'post',
        url: `${SERVER_URL}/songs/`,
        data: formData,
        headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(res => {
        console.log(res);
        console.log(res.data);
    })
    .catch(error => {
        console.log(error);
    });

    return 0;
};
