import { useState, useRef, useEffect } from "react";
import { FastFourier } from './Music';
import Cookies from "js-cookie";
import axios from "axios";
import { SERVER_URL } from "../../shared functions/constants";

const useLoadSong = ( id: number ) => {
    const [player, setPlayer] = useState<FastFourier | null>(null);
    const playerRef = useRef<FastFourier | null>(null);

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
                    return;
                }
    
                const audioBuffer = await getAudioBuffer();
                const newPlayer = new FastFourier(audioBuffer);
    
                setPlayer(newPlayer);
                playerRef.current = newPlayer;
            } catch (error) {
                console.error(`Error initializing player: ${error}`);
                throw error;
            }
        };
    
        initializePlayer();

        return () => {
            playerRef.current?.cleanUp();
          };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return player;
};

export default useLoadSong;