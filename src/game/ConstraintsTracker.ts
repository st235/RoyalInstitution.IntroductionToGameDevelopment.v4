import type { LevelConstraints } from "@game/config/LevelConfigReader";

import { convertMsToFormattedMinSecTime } from "@/util/Time";
import Timer from "@game/Timer";

type OnFlagReadyListener = () => void;
type OnMovesLeftListener = (movesLeft: number) => void;
type OnTimeLeftListener = (time: string) => void;
type OnGameOverListener = () => void;

class ConstraintsTracker {

    private readonly _timer?: Timer;
    private _movesLeft?: number;
    private _scoreLeft?: number;

    private _onFlagReadyListener?: OnFlagReadyListener;
    private _onMovesLeftListener?: OnMovesLeftListener;
    private _onTimeLeftListener?: OnTimeLeftListener;
    private _onGameOverListener?: OnGameOverListener;

    constructor(constraints?: LevelConstraints) {
        if (constraints?.maxTimeSec) {
            this._timer = new Timer(constraints.maxTimeSec * 1000);
        }
        if (constraints?.maxMoves) {
            this._movesLeft = constraints.maxMoves;
        }
        if (constraints?.minScore) {
            this._scoreLeft = constraints.minScore;
        }
    }

    setOnFlagReadyListener(onFlagReadyListener?: OnFlagReadyListener) {
        this._onFlagReadyListener = onFlagReadyListener;
        if (!this._scoreLeft) {
            this._onFlagReadyListener?.();
        }
    }

    setOnMovesLeftListener(onMovesLeftListener?: OnMovesLeftListener) {
        this._onMovesLeftListener = onMovesLeftListener;
        if (this._movesLeft) {
            this._onMovesLeftListener?.(this._movesLeft);
        }
    }

    setOnTimeLeftListener(onTimeLeftListener?: OnTimeLeftListener) {
        this._onTimeLeftListener = onTimeLeftListener;
        if (this._timer) {
            this._onTimeLeftListener?.(convertMsToFormattedMinSecTime(this._timer.getRemainingTimeMs()));
        }
    }

    setOnGameOverListener(onGameOverListener?: OnGameOverListener) {
        this._onGameOverListener = onGameOverListener;
    }

    hasTimeConstraint(): boolean {
        return this._timer !== undefined;
    }

    hasMovesConstraint(): boolean {
        return this._movesLeft !== undefined;
    }

    addScore(score: number) {
        if (!this._scoreLeft || this._scoreLeft <= 0) {
            return;
        }

        this._scoreLeft = Math.max(0, this._scoreLeft - score);
        if (this._scoreLeft == 0) {
            this._onFlagReadyListener?.();
        }
    }

    movePlayer() {
        if (!this._movesLeft || this._movesLeft <= 0) {
            return;
        }

        this._movesLeft -= 1;
        this._onMovesLeftListener?.(this._movesLeft);
        if (this._movesLeft == 0) {
            this._onGameOverListener?.();
        }
    }

    update(dtMs: number) {
        if (this._timer) {
            this._timer.update(dtMs);
            this._onTimeLeftListener?.(convertMsToFormattedMinSecTime(this._timer.getRemainingTimeMs()));
        }

        if (this._timer?.isElapsed()) {
            this._onGameOverListener?.();
        }
    }

}

export default ConstraintsTracker;
