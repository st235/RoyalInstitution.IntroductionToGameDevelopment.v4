import Phaser from "phaser";

import KeyboardMapper from "@game/KeyboardMapper";
import Player from "@game/Player";

class PlayerController {

    private readonly _player: Player;
    private readonly _mapper: KeyboardMapper;

    constructor(player: Player, mapper: KeyboardMapper) {
        this._player = player;
        this._mapper = mapper;
    }

    handleInput(canNavigate: (position: [number, number]) => boolean) {
        if (this._mapper.justDown("left")
            && canNavigate(this._player.getFacingPoint([-1, 0]))) {
            this._player.goLeft();
        }

        if (this._mapper.justDown("up")
            && canNavigate(this._player.getFacingPoint([0, -1]))) {
            this._player.goUp();
        }

        if (this._mapper.justDown("right")
            && canNavigate(this._player.getFacingPoint([1, 0]))) {
            this._player.goRight();
        }

        if (this._mapper.justDown("down")
            && canNavigate(this._player.getFacingPoint([0, 1]))) {
            this._player.goDown();
        }
    }

    static wrap(scene: Phaser.Scene, player: Player): PlayerController {
        const mapper = new KeyboardMapper(scene, {
            left: [
                Phaser.Input.Keyboard.KeyCodes.LEFT,
                Phaser.Input.Keyboard.KeyCodes.A,
            ],
            right: [
                Phaser.Input.Keyboard.KeyCodes.RIGHT,
                Phaser.Input.Keyboard.KeyCodes.D,
            ],
            down: [
                Phaser.Input.Keyboard.KeyCodes.DOWN,
                Phaser.Input.Keyboard.KeyCodes.S,
            ],
            up: [
                Phaser.Input.Keyboard.KeyCodes.UP,
                Phaser.Input.Keyboard.KeyCodes.W,
            ],
        });

        return new PlayerController(player, mapper);
    }
}

export default PlayerController;