import Phaser from "phaser";

import FogOfWarFXPipeline, { KEY_FX_FOW } from "@game/fx/FogOfWarFXPipeline";

import KeyboardMapper from "@game/KeyboardMapper";
import Player from "@game/Player";

class PlayerController {

    private readonly _player: Player;
    private readonly _mapper: KeyboardMapper;
    private readonly _onPlayerMadeMoved?: () => void;

    constructor(player: Player, mapper: KeyboardMapper,
        onPlayerMadeMoved?: () => void) {
        this._player = player;
        this._mapper = mapper;
        this._onPlayerMadeMoved = onPlayerMadeMoved;
    }

    handleInput(canNavigate: (position: [number, number]) => boolean) {
        if (!this._player.active) {
            return;
        }

        if (this._mapper.justDown("left")
            && canNavigate(this._player.getFacingPoint([-1, 0]))) {
            this._player.goLeft();
            this._onPlayerMadeMoved?.();
        }

        if (this._mapper.justDown("up")
            && canNavigate(this._player.getFacingPoint([0, -1]))) {
            this._player.goUp();
            this._onPlayerMadeMoved?.();
        }

        if (this._mapper.justDown("right")
            && canNavigate(this._player.getFacingPoint([1, 0]))) {
            this._player.goRight();
            this._onPlayerMadeMoved?.();
        }

        if (this._mapper.justDown("down")
            && canNavigate(this._player.getFacingPoint([0, 1]))) {
            this._player.goDown();
            this._onPlayerMadeMoved?.();
        }

        const fowFXPipeline = 
            this._player.scene.cameras.main.getPostPipeline(KEY_FX_FOW);
        if (fowFXPipeline && !(Array.isArray(fowFXPipeline) && fowFXPipeline.length == 0)) {
            (fowFXPipeline as FogOfWarFXPipeline).setPlayerCoordinates(this._player.x, this._player.y);
        }
    }

    static wrap(scene: Phaser.Scene, player: Player,
        onPlayerMadeMoved?: () => void): PlayerController {
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

        return new PlayerController(player, mapper, onPlayerMadeMoved);
    }
}

export default PlayerController;