export const formatTime = (timeInSeconds:number):string => {
    const seconds = Math.floor(timeInSeconds % 60);

    const minutes = Math.floor(timeInSeconds / 60);
    return `${minutes}:${seconds >= 10 ? seconds: "0" + seconds}`;
}
