import defaultGameConfig from "@assets/configs/default_game_config.json";

import type { VariableTileAppearance } from "@game/config/TileVariationReader";
import type { CharacterConfig } from "@game/config/CharacterConfigReader";
import type { CoinsConfig } from "@game/config/CoinsConfigReader";
import type { DoorsConfig } from "@game/config/DoorsConfigReader";
import type { GarnitureConfig } from "@game/config/GarnitureConfigReader";
import type { MonstersConfig } from "@game/config/MonstersConfigReader";

type MessageOverwrites = {
    character?: number;
    intro: string;
    gameOver?: string;
    victory?: string;
};

type GameConfig = {
    useColourTiles?: boolean;
    applyCathodRayTubeEffect: boolean;
    messagesOverwrites?: MessageOverwrites;
    configsOverwrites?: {
        character?: CharacterConfig;
        coins?: CoinsConfig;
        doors?: DoorsConfig;
        flags?: VariableTileAppearance;
        garnitures?: GarnitureConfig;
        monsters?: MonstersConfig[];
        walls?: VariableTileAppearance;
    };
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
        return this._config.applyCathodRayTubeEffect;
    }

    getMessageOverwrites(): MessageOverwrites | undefined {
        return this._config.messagesOverwrites;
    }

    getCharacterConfig(): CharacterConfig | undefined {
        return this._config.configsOverwrites?.character;
    }

    getCoinsConfig(): CoinsConfig | undefined {
        return this._config.configsOverwrites?.coins;
    }

    getDoorsConfig(): DoorsConfig | undefined {
        return this._config.configsOverwrites?.doors;
    }

    getFlagsConfig(): VariableTileAppearance | undefined {
        return this._config.configsOverwrites?.flags;
    }

    getGarnitureConfig(): GarnitureConfig | undefined {
        return this._config.configsOverwrites?.garnitures;
    }

    getMonstersConfig(): MonstersConfig[] | undefined {
        return this._config.configsOverwrites?.monsters;
    }

    getWallsConfig(): VariableTileAppearance | undefined {
        return this._config.configsOverwrites?.walls;
    }

    public static create(config: GameConfig = defaultGameConfig): GameConfigReader {
        return new GameConfigReader(config);
    }
}

export default GameConfigReader;
export type { GameConfig, MessageOverwrites };
