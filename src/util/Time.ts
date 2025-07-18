function convertMsToFormattedMinSecTime(timeMs: number) {
    const minutes = Math.floor(timeMs / 1000 / 60).toString().padStart(2, "0");
    const seconds = Math.floor(timeMs / 1000 % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

export { convertMsToFormattedMinSecTime };
