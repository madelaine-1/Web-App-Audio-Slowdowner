import * as Tone from 'tone';

export interface Music {
    length: number;
    currentTime: number;
    isPlaying: boolean;

    pausePlay: Function;
    skipTo: Function;
    changePitch: Function;
    changeVolume: Function;
    // loop: Function;
}

export class FastFourier implements Music {
    length: number = -1;
    currentTime: number = 0;
    isPlaying: boolean = false;
    buffer: AudioBuffer | undefined = undefined;
    sourceNode: AudioBufferSourceNode | undefined = undefined;
    gainNode: GainNode | undefined = undefined;
    audioContext: AudioContext;
    intervalID: any;

    constructor(audioBuffer: ArrayBuffer);
    constructor(audioBuffer: AudioBuffer);
    constructor(audioBuffer: ArrayBuffer | AudioBuffer) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if(audioBuffer instanceof ArrayBuffer) {
            this.audioContext.decodeAudioData(audioBuffer).
            then(
                newBuffer => {
                    this.buffer = newBuffer;
                    this.length = this.buffer.duration;
                    this.sourceNode = this.audioContext.createBufferSource();
                    this.gainNode = this.audioContext.createGain();
                    this.sourceNode.buffer = newBuffer;
                }
            ).catch(
                error => console.error('Error decoding audio data:', error)
            );
        } else if (audioBuffer instanceof AudioBuffer) {
            console.log("loading buffer...");
            this.buffer = audioBuffer;
            this.length = this.buffer.duration;
            this.sourceNode = this.audioContext.createBufferSource();
            this.gainNode = this.audioContext.createGain();
            this.sourceNode.buffer = audioBuffer;
        } else {
            throw new Error('Invalid data type')
        }

        console.log("Creating interval...");

        this.intervalID = setInterval(() => {
            if (this.isPlaying) {
                this.currentTime += 0.2;
            }
        }, 200);
    }

    cleanUp = () => {
        try {
            this.audioContext.close();
            clearInterval(this.intervalID);
        } catch (error) {
            throw error;
        }
    }
    
    pausePlay = async () => {
        if (!this.buffer || !this.audioContext) {
            throw new Error("Audio not properly initialized");
        }

        if (this.isPlaying) {
            this.isPlaying = false;
            await this.sourceNode?.stop();
            this.sourceNode = undefined;
        } else {
            this.isPlaying = true;
            this.sourceNode = await this.audioContext.createBufferSource();
            this.sourceNode.buffer = this.buffer;
            this.sourceNode.connect(this.audioContext.destination);
            await this.sourceNode.start(undefined, this.currentTime);
        }
    };

    skipTo = async(newTime: number) => {
        if (!this.buffer || !this.audioContext) {
            throw new Error("Audio not properly initialized");
        }

        this.currentTime = newTime;

        if (this.isPlaying) {
            this.sourceNode?.stop();
            this.sourceNode = this.audioContext.createBufferSource();
            this.sourceNode.buffer = this.buffer;
            this.sourceNode.connect(this.audioContext.destination);
            this.sourceNode.start(undefined, newTime);
        }
    };

    changePitch = (cents: number) => {
        if (!this.buffer || !this.sourceNode || !this.audioContext) {
            throw new Error("Audio not properly initialized");
        }

        this.sourceNode.detune.value = cents;
    };

    changeVolume = (percent: number) => {
        if (!this.buffer || !this.sourceNode || !this.audioContext || !this.gainNode) {
            throw new Error("Audio not properly initialized");
        }

        this.gainNode.gain.value = (1 - (percent / 100)) * (-60);
    };

    loop = (loop: boolean, start: number | null = null, end: number | null = null)  => {
        if (!this.buffer || !this.sourceNode || !this.audioContext || !this.gainNode) {
            throw new Error("Audio not properly initialized");
        }

        if ((start !== null && end !== null) && (start < 0 || start > end || end > this.length)) {
            throw new Error("start and end are not in the correct range");
        }
    }
}

export class ToneJS implements Music {
    buffer: Tone.ToneAudioBuffer | undefined = undefined;
    player: Tone.GrainPlayer | undefined = undefined;
    length: number = -1;
    isPlaying: boolean = false;
    currentTime: number = 0;
    intervalID: any = undefined;

    constructor(audio: string);
    constructor(audio: AudioBuffer);
    constructor(audio: string | AudioBuffer) {
        try {
            // Initialize buffer and player
            if (audio instanceof AudioBuffer) {
                this.buffer = new Tone.ToneAudioBuffer(audio);
                this.player = new Tone.GrainPlayer(this.buffer).toDestination();
            } else if (typeof audio === 'string') {
                this.buffer = new Tone.ToneAudioBuffer(audio);
                this.player = new Tone.GrainPlayer(this.buffer).toDestination();
            } else {
                throw new Error('Invalid audio type');
            }
            
            // create time interval
            this.intervalID = setInterval(() => {
                if (this.isPlaying) {
                    this.currentTime += 0.2;
                }
            }, 200);

            this.length = this.buffer.duration;
            Tone.start();
        } catch( error ) {
            this.cleanUp();
            throw error;
        }
    }

    cleanUp = async () => {
        try {
            this.player?.disconnect();
            this.buffer?.dispose();
            clearInterval(this.intervalID);
        } catch (error) {
            throw error;
        }

        this.length = -1;
    };

    pausePlay = async () => {
        if (this.player === undefined) {
            return 1;
        }

        if (this.isPlaying) {
            await this.player.stop();
            this.isPlaying = false;
        } else {
            await this.player.start(undefined, this.currentTime);
            this.isPlaying = true;
        }

        return 0;
    };


    // skips to a given time in seconds
    skipTo = async (newTime: number) => {
        if (this.player === undefined) {
            throw new Error("Player does not exist");
        }
        this.currentTime = newTime;

        if (this.isPlaying) {
            this.player.stop();
            this.player.start(undefined, newTime);
        }
    };


    // changes the pitch of the player by given amount of cents (positive or negative)
    changePitch = (cents: number) => {
        if (this.player === undefined) {
            throw new Error("Player does not exist");
        }

        this.player.detune = cents;
    };

    // changes the volume given a certain percent
    changeVolume = (percent: number) => {
        if (this.player === undefined) {
            throw new Error("Player does not exist");
        }

        this.player.volume.value = (1 - (percent / 100)) * (-60);
    };
}