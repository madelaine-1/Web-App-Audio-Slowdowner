import * as Tone from 'tone';

interface Music {
    isPlaying: boolean
    length: number
    pausePlay: Function
    skipTo: Function
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
    // FIX
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

    // returns current time
    getCurrentTime = (): number => {
        return this.currentTime;
    };
}