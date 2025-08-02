import type { GameConfig, ConfigOverwrites, MessageOverwrites } from "@game/config/GameConfigReader";
import type { LevelConfig } from "@game/config/LevelConfigReader";

type ConfigProvider = {
    messageOverwrites?: MessageOverwrites,
    configOverwrites?: ConfigOverwrites,
};

type ConfigOverwriteMapperFunction = (data: unknown, outConfigProvider: ConfigProvider) => void;

function _WrapOverwriteMapper<T>(calculation: (data: T, outConfigProvider: ConfigProvider) => void): ConfigOverwriteMapperFunction {
    return (data: unknown, outConfigProvider: ConfigProvider) => {
        calculation(data as T, outConfigProvider);
    };
}

const configOverwritesMappers: {[Key: string]: ConfigOverwriteMapperFunction} = {
    "message.intro": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        if (!outConfigProvider.messageOverwrites) {
            outConfigProvider.messageOverwrites = {};
        }
        outConfigProvider.messageOverwrites.intro = data.value;
    }),
    "message.gameOver": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        if (!outConfigProvider.messageOverwrites) {
            outConfigProvider.messageOverwrites = {};
        }
        outConfigProvider.messageOverwrites.gameOver = data.value;
    }),
    "message.victory": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        if (!outConfigProvider.messageOverwrites) {
            outConfigProvider.messageOverwrites = {};
        }
        outConfigProvider.messageOverwrites.victory = data.value;
    }),
    "config.walls": _WrapOverwriteMapper((data: {value: string}, outConfigProvider: ConfigProvider) => {
        if (!outConfigProvider.configOverwrites) {
            outConfigProvider.configOverwrites = {};
        }

        outConfigProvider.configOverwrites.walls = {
            variations: data.value.split(/,\s*/).map(v => parseInt(v)),
        };
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

    let gameConfig: GameConfig | undefined = undefined;
    if (configProvider.messageOverwrites || configProvider.configOverwrites) {
        gameConfig = {
            messagesOverwrites: configProvider.messageOverwrites,
            configOverwrites: configProvider.configOverwrites,
        };
    }

    return [gameConfig, undefined];
}


export { ObtainGameAndLevelConfigsOverwrites };
