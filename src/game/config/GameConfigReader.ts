import defaultGameConfig from "@assets/configs/default_game_config.json";

type GameConfig = {
    useColourTiles: boolean;
    applyCathodRayTubeEffect: boolean;
    applyFogOfWar: boolean;
    background?: string;
};

class GameConfigReader {
    private readonly _config: GameConfig;
    
    constructor(config: GameConfig) {
        this._config = config;
    }

    isUsingColourTiles(): boolean {
        return this._config.useColourTiles;
    }

    shouldUseCathodRayTubeEffect(): boolean {
        return this._config.applyCathodRayTubeEffect;
    }

    shouldUseFogOfWar(): boolean {
        return this._config.applyFogOfWar;
    }

    background(): number | undefined {
        const hexBackgroundValue = this._config.background?.replaceAll("#", "");
        if (hexBackgroundValue === undefined) {
            return undefined;
        }
        return parseInt(hexBackgroundValue, 16);
    }

    public static create(config: GameConfig = defaultGameConfig): GameConfigReader {
        return new GameConfigReader(config);
    }
}

export default GameConfigReader;
export type { GameConfig };
