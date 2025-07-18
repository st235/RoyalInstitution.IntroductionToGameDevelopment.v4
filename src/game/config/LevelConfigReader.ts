type LevelConstraints = {
    maxTimeSec?: number;
    maxMoves?: number;
    minScore?: number;
};

type LevelConfig = {
    id: number;
    title: string;
    applyFogOfWar?: boolean;
    background?: string;
    levelLayout: string[];
    constraints: LevelConstraints;
    nextLevelId?: number;
};

class LevelConfigReader {
    private readonly _config: LevelConfig;
    
    constructor(config: LevelConfig) {
        this._config = config;
    }

    getId(): number {
        return this._config.id;
    }

    getTitle(): string {
        return this._config.title;
    }

    shouldUseFogOfWar(): boolean {
        return this._config.applyFogOfWar ?? false;
    }

    background(): number | undefined {
        const hexBackgroundValue = this._config.background?.replaceAll("#", "");
        if (hexBackgroundValue === undefined) {
            return undefined;
        }
        return parseInt(hexBackgroundValue, 16);
    }

    getLevelLayout(): string[] {
        return this._config.levelLayout;
    }

    getLevelConstraints(): LevelConstraints {
        return this._config.constraints;
    }

    getNextLevelId(): number | undefined {
        return this._config.nextLevelId;
    }

    public static create(config: LevelConfig): LevelConfigReader {
        return new LevelConfigReader(config);
    }
}

export default LevelConfigReader;
export type { LevelConfig, LevelConstraints };
