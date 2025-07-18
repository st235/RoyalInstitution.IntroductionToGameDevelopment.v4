import defaultCharacterConfig from "@assets/configs/default_character_config.json";

type CharacterConfig = {
    tile: number;
};

class CharacterConfigReader {

    private readonly _characterConfig: CharacterConfig;

    constructor(characterConfig: CharacterConfig) {
        this._characterConfig = characterConfig;
    }

    public getTile(): number {
        return this._characterConfig.tile;
    }

    public static create(characterTile: CharacterConfig = defaultCharacterConfig): CharacterConfigReader {
        return new CharacterConfigReader(characterTile);
    }
}

export default CharacterConfigReader;
export type { CharacterConfig };
