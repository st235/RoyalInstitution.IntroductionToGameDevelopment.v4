const _DEFAULT_TIME_UP_THRESHOLD_MS = 5000;

class Timer {

    private readonly _timeMs: number;
    private readonly _timeUpThresholdMs: number;
    private _elapsedTimeMs: number;
    private _timeUpNotified: boolean;

    constructor(timeMs: number,
        timeUpThresholdMs?: number) {
        this._timeMs = timeMs;
        this._timeUpThresholdMs = timeUpThresholdMs ?? _DEFAULT_TIME_UP_THRESHOLD_MS;
        this._elapsedTimeMs = 0;
        this._timeUpNotified = false;
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

    isTimeUp(): boolean {
        if (this._timeUpNotified) {
            return false;
        }

        const remainingTimeMs = this._timeMs - this._elapsedTimeMs;
        if (remainingTimeMs <= this._timeUpThresholdMs) {
            this._timeUpNotified = true;
            return true;
        }
        return false;
    }

    getRemainingTimeMs(): number {
        return Math.max(this._timeMs - this._elapsedTimeMs, 0);
    }
}

export default Timer;
