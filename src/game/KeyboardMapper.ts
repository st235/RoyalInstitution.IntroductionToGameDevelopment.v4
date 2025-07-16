import Phaser from "phaser";

import { assert } from "@/util/Assert";

type KeyboardMapping = { [Key: string]: (number | number[]) };

class KeyboardMapper {

    private readonly _inputs: {[Key: string]: Phaser.Input.Keyboard.Key[]};

    constructor(scene: Phaser.Scene, mapping: KeyboardMapping) {
        const keyboard = scene.input.keyboard;
        assert(keyboard !== null, "KeyboardMapper requires for keyboard to be initialised.");

        this._inputs = {};
        for (const mappingKey in mapping) {
            const rawValue = mapping[mappingKey];
            if (rawValue === undefined) {
                continue;
            }

            const keyCodesArray = Array.isArray(rawValue) ? rawValue : [rawValue];
            for (let i = 0; i < keyCodesArray.length; i++) {
                const key = keyboard?.addKey(keyCodesArray[i]);
                if (!key) {
                    continue;
                }

                if (!this._inputs[mappingKey]) {
                    this._inputs[mappingKey] = [];
                }

                this._inputs[mappingKey].push(key);
            }
        }
    }

    justDown(mappingKey: string): boolean {
        const keyCodesArray = this._inputs[mappingKey];
        if (!keyCodesArray) {
            return false;
        }

        for (let i = 0; i < keyCodesArray.length; i++) {
            if (Phaser.Input.Keyboard.JustDown(keyCodesArray[i])) {
                return true;
            }
        }

        return false;
    }
}

export default KeyboardMapper;
