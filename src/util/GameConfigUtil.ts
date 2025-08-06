import type { CoinInfo } from "@game/config/CoinsConfigReader";
import type { GameConfig } from "@game/config/GameConfigReader";
import type { LevelConfig } from "@game/config/LevelConfigReader";
import type { MonstersConfig } from "@game/config/MonstersConfigReader";

type ConfigProvider = {
    messageIntro?: string;
    messageGameOver?: string;
    messageVictory?: string;
    wallTiles?: number[];
    levelLayout?: string[];
    coinDefaultScore?: number;
    coinValues?: CoinInfo[];
    coinTiles?: number[];
    keys?: number[];
    closeDoors?: number[];
    openDoors?: number[];
    monsters?: MonstersConfig[];
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
    "message.intro": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.messageIntro = data.value;
    }),
    "message.gameOver": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.messageGameOver = data.value;
    }),
    "message.victory": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.messageVictory = data.value;
    }),
    "level.layout": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.levelLayout = data.value.split(/\r?\n/);
    }),
    "config.walls": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.wallTiles = _ParseVariations(data.value);
    }),
    "config.coins.default-score": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.coinDefaultScore = parseInt(data.value);
    }),
    "config.coins.values": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        outConfigProvider.coinValues = data.value.split(/\r?\n/).map(line => {
            const splits = line.split(/\s+/).map(v => parseInt(v));
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
        outConfigProvider.monsters = data.value.split(/\r?\n/)
            .map((line, index) => {
                const raws = line.split(/\s+/);

                return {
                    id: index,
                    variant: parseInt(raws[0]),
                    updateTimeMs: parseInt(raws[1]),
                    path: raws.slice(2),
                };
            });
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
        messagesOverwrites: {
            intro: configProvider.messageIntro,
            gameOver: configProvider.messageGameOver,
            victory: configProvider.messageVictory,
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
        }
    };

    let levelConfig: LevelConfig | undefined = undefined;
    if (configProvider.levelLayout) {
        levelConfig = {
            id: 0,
            title: "My first level",
            levelLayout: configProvider.levelLayout,
            constraints: {},
        };
    }

    return [gameConfig, levelConfig];
}


export { ObtainGameAndLevelConfigsOverwrites };
