class Timer {

    private readonly _timeMs: number;
    private _elapsedTimeMs: number;

    constructor(timeMs: number) {
        this._timeMs = timeMs;
        this._elapsedTimeMs = 0;
    }

    update(dtMs: number) {
        if (this.isElapsed()) {
            return;
        }

        this._elapsedTimeMs += dtMs;
    }

    isElapsed(): boolean {
        return this._elapsedTimeMs >= this._timeMs;
    }

    getRemainingTimeMs(): number {
        return Math.max(this._timeMs - this._elapsedTimeMs, 0);
    }
}

export default Timer;
