import defaultGameConfig from "@assets/game/configs/default_game_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";
import type { CharacterConfig } from "@game/config/CharacterConfigReader";
import type { CoinsConfig } from "@game/config/CoinsConfigReader";
import type { DoorsConfig } from "@game/config/DoorsConfigReader";
import type { GarnitureConfig } from "@game/config/GarnitureConfigReader";
import type { MonstersConfig } from "@game/config/MonstersConfigReader";

type ConfigOverwrites = {
    character?: CharacterConfig;
    coins?: CoinsConfig;
    doors?: DoorsConfig;
    flags?: VariableTileAppearance;
    garnitures?: GarnitureConfig;
    monsters?: MonstersConfig[];
    walls?: VariableTileAppearance;
};

type MessageOverwrites = {
    character?: number;
    intro?: string;
    introHeight?: number;
    gameOver?: string;
    gameOverHeight?: number;
    victory?: string;
    victoryHeight?: number;
};

type GameConfig = {
    useColourTiles?: boolean;
    applyCathodRayTubeEffect?: boolean;
    messagesOverwrites?: MessageOverwrites;
    configOverwrites?: ConfigOverwrites;
};

class GameConfigReader {
    private readonly _config: GameConfig;
    
    constructor(config: GameConfig) {
        this._config = config;
    }

    isUsingColourTiles(): boolean {
        return this._config.useColourTiles ?? true;
    }

    shouldUseCathodRayTubeEffect(): boolean {
        return this._config.applyCathodRayTubeEffect ?? false;
    }

    getMessageOverwrites(): MessageOverwrites | undefined {
        return this._config.messagesOverwrites;
    }

    getCharacterConfig(): CharacterConfig | undefined {
        return this._config.configOverwrites?.character;
    }

    getCoinsConfig(): CoinsConfig | undefined {
        return this._config.configOverwrites?.coins;
    }

    getDoorsConfig(): DoorsConfig | undefined {
        return this._config.configOverwrites?.doors;
    }

    getFlagsConfig(): VariableTileAppearance | undefined {
        return this._config.configOverwrites?.flags;
    }

    getGarnitureConfig(): GarnitureConfig | undefined {
        return this._config.configOverwrites?.garnitures;
    }

    getMonstersConfig(): MonstersConfig[] | undefined {
        return this._config.configOverwrites?.monsters;
    }

    getWallsConfig(): VariableTileAppearance | undefined {
        return this._config.configOverwrites?.walls;
    }

    public static create(config: GameConfig = defaultGameConfig): GameConfigReader {
        return new GameConfigReader(config);
    }
}

export default GameConfigReader;
export type { GameConfig, ConfigOverwrites, MessageOverwrites, };
