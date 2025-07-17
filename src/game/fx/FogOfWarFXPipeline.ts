import Phaser from "phaser";

const KEY_FX_FOW = "FogOfWarFXPipeline";

const fragmentShader = `
#define SHADER_NAME FOW_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uRadius;
uniform vec2 uPosition;

void main() {
    vec2 playerPosition = vec2(uPosition.x, uResolution.y - uPosition.y);

    vec2 dc = abs(playerPosition - gl_FragCoord.xy);
    dc *= dc;
    float distance = sqrt(dc.x + dc.y);

    if (distance > uRadius) {
        gl_FragColor = vec4(0.0,0.0,0.0,1.0);
    } else {
        gl_FragColor = vec4(texture2D(uMainSampler, gl_FragCoord.xy/uResolution.xy).rgb, 1.0);
    }
}
`;

class FogOfWarFXPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {

    private _radius: number;
    private _playerCoordinates: [number, number];

    constructor(game: Phaser.Game) {
        super({
            game,
            renderTarget: true,
            fragShader: fragmentShader,
        });

        this._radius = 0.25;
        this._playerCoordinates = [0.5, 0.5];
    }

    setRadius(radius: number) {
        this._radius = radius;
    }

    setPlayerCoordinates(x: number, y: number) {
        this._playerCoordinates = [x, y];
    }

    onPreRender() {
        this.set2f("uResolution", this.game.scale.width, this.game.scale.height);
        this.set1f("uRadius",
            Math.min(this.game.scale.width, this.game.scale.height) * this._radius);
        this.set2f("uPosition",
            this._playerCoordinates[0],
            this._playerCoordinates[1]);
    }
};

export default FogOfWarFXPipeline;
export { KEY_FX_FOW };
