import { parseBoolean } from "@/util/Booleans";
import { splitByNewLine, splitByWhitespace } from "@/util/Strings";
import type { CoinInfo } from "@game/config/CoinsConfigReader";
import type { GameConfig } from "@game/config/GameConfigReader";
import type { GarnitureConfig } from "@game/config/GarnitureConfigReader";
import type { LevelConfig } from "@game/config/LevelConfigReader";
import type { MonstersConfig } from "@game/config/MonstersConfigReader";

type ConfigProvider = {
    // Level info.
    levelTitle?: string;
    levelLayout?: string[];

    // Level constraints.
    constraintTime?: number;
    constraintMaxSteps?: number;
    constraintMinScore?: number;

    // Dialogs.
    dialogIntro?: string;
    dialogGameOver?: string;
    dialogVictory?: string;

    // Config overwrites.
    closeDoors?: number[];
    coinDefaultScore?: number;
    coinTiles?: number[];
    coinValues?: CoinInfo[];
    flags?: number[];
    garniture?: GarnitureConfig;
    keys?: number[];
    monsters?: MonstersConfig[];
    openDoors?: number[];
    wallTiles?: number[];

    // FX.
    applyFogOfWar?: boolean;
    applyCathodRayTube?: boolean;
};

type ConfigOverwriteMapperFunction = (data: unknown, outConfigProvider: ConfigProvider) => void;

function _WrapOverwriteMapper<T>(calculation: (data: T, outConfigProvider: ConfigProvider) => void): ConfigOverwriteMapperFunction {
    return (data: unknown, outConfigProvider: ConfigProvider) => {
        calculation(data as T, outConfigProvider);
    };
}

function _ParseVariations(value: string): number[] {
    return value.split(/,\s*/).map(v => parseInt(v));
}

const configOverwritesMappers: {[Key: string]: ConfigOverwriteMapperFunction} = {
    // Level info.
    "level.title": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.levelTitle = data.value;
    }),
    "level.layout": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.levelLayout = splitByNewLine(data.value);
    }),

    // Level constraints.
    "constraint.time": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        if (data.value && data.value.trim().length > 0) {
            outConfigProvider.constraintTime = parseInt(data.value);
        }
    }),
    "constraint.max-moves": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        if (data.value && data.value.trim().length > 0) {
            outConfigProvider.constraintMaxSteps = parseInt(data.value);
        }
    }),
    "constraint.min-score": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        if (data.value && data.value.trim().length > 0) {
            outConfigProvider.constraintMinScore = parseInt(data.value);
        }
    }),

    // Dialogs.
    "dialog.intro": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.dialogIntro = data.value;
    }),
    "dialog.game-over": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.dialogGameOver = data.value;
    }),
    "dialog.victory": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.dialogVictory = data.value;
    }),

    // Config overwrites.
    "config.walls": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.wallTiles = _ParseVariations(data.value);
    }),
    "config.coins.default-score": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.coinDefaultScore = parseInt(data.value);
    }),
    "config.coins.values": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.coinValues = splitByNewLine(data.value).map(line => {
            const splits = splitByWhitespace(line).map(v => parseInt(v));
            return {
                variant: splits[0],
                score: splits[1],
            };
        });
    }),
    "config.coins.tiles": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.coinTiles = _ParseVariations(data.value);
    }),
    "config.keys": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.keys = _ParseVariations(data.value);
    }),
    "config.doors.close": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.closeDoors = _ParseVariations(data.value);
    }),
    "config.doors.open": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.openDoors = _ParseVariations(data.value);
    }),
    "config.monsters": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.monsters = splitByNewLine(data.value)
            .map((line, index) => {
                const raws = splitByWhitespace(line);

                return {
                    id: index,
                    variant: parseInt(raws[0]),
                    updateTimeMs: parseInt(raws[1]),
                    path: raws.slice(2),
                };
            });
    }),
    "config.garniture": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        const flat: [number, number | undefined][] = splitByNewLine(data.value)
            .map((line, index) => {
                const raws = splitByWhitespace(line);
                return [parseInt(raws[0]), parseBoolean(raws[1]) ? index : undefined];
            });

        outConfigProvider.garniture = {
            variations: flat.map(v => v[0]),
            collides: flat.map(v => v[1]).filter(v => v !== undefined),
        };
    }),
    "config.flags": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.flags = _ParseVariations(data.value);
    }),

    // FX.
    "fx.fog-of-war": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.applyFogOfWar = parseBoolean(data.value);
    }),
    "fx.cathod-ray-tube": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.applyCathodRayTube = parseBoolean(data.value);
    }),
};

function _GetConfigProvider(
    persistencyStateLookup: {[Key: string]: object},
): ConfigProvider {
    const outConfigProvider: ConfigProvider = {};

    for (const [persistencyId, state] of Object.entries(persistencyStateLookup)) {
        configOverwritesMappers[persistencyId]?.(state, outConfigProvider);
    }

    return outConfigProvider;
}

function ObtainGameAndLevelConfigsOverwrites(
    persistencyStateLookup: {[Key: string]: object},
): [GameConfig | undefined, LevelConfig | undefined] {
    const configProvider = _GetConfigProvider(persistencyStateLookup);

    const gameConfig: GameConfig = {
        applyCathodRayTubeEffect: configProvider.applyCathodRayTube ?? false,
        messagesOverwrites: {
            intro: configProvider.dialogIntro,
            gameOver: configProvider.dialogGameOver,
            victory: configProvider.dialogVictory,
        },
        configOverwrites: {
            ...(configProvider.wallTiles && { walls: { variations: configProvider.wallTiles } }),
            ...(configProvider.coinTiles && { coins: { defaultScore: configProvider.coinDefaultScore, coins: configProvider.coinValues, variations: configProvider.coinTiles, }}),
            ...((configProvider.keys && configProvider.closeDoors && configProvider.openDoors) && {
                doors: { key: { variations: configProvider.keys },
                    door: { 
                        closed: { variations: configProvider.closeDoors },
                        open: { variations: configProvider.openDoors }
                    }
                }
            }),
            ...(configProvider.monsters && { monsters: configProvider.monsters }),
            ...(configProvider.garniture && { garnitures: configProvider.garniture }),
            ...(configProvider.flags && { flags: { variations: configProvider.flags } }),
        }
    };

    let levelConfig: LevelConfig | undefined = undefined;
    if (configProvider.levelLayout) {
        levelConfig = {
            id: 0,
            title: configProvider.levelTitle ?? "My first level",
            applyFogOfWar: configProvider.applyFogOfWar ?? false,
            levelLayout: configProvider.levelLayout,
            constraints: {
                maxTimeSec: configProvider.constraintTime,
                maxMoves: configProvider.constraintMaxSteps,
                minScore: configProvider.constraintMinScore,
            },
        };
    }

    return [gameConfig, levelConfig];
}


export { ObtainGameAndLevelConfigsOverwrites };
