import defaultCharacterConfig from "@assets/configs/default_character_config.json";

type CharacterTile = {
    tile: number;
};

class CharacterConfig {

    private readonly _tileProvider: CharacterTile;

    constructor(tileProvider: CharacterTile) {
        this._tileProvider = tileProvider;
    }

    public getTile(): number {
        return this._tileProvider.tile;
    }

    public static create(characterTile: CharacterTile = defaultCharacterConfig): CharacterConfig {
        return new CharacterConfig(characterTile);
    }
}

export default CharacterConfig;
