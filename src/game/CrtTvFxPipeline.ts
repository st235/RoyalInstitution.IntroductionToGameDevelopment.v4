import Phaser from "phaser";

const fragmentShader = `
#define SHADER_NAME CRT_FS

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
uniform vec2 uResolution;

// --- [ original shader ] ---
// source: https://www.shadertoy.com/view/WsVSzV

float warp = 0.85; // simulate curvature of CRT monitor
float scan = 0.25; // simulate darkness between scanlines

void mainImage(out vec4 fragColor,in vec2 fragCoord)
{
  // squared distance from center
  vec2 uv = fragCoord/uResolution.xy;
  vec2 dc = abs(0.5-uv);
  dc *= dc;
  
  // warp the fragment coordinates
  uv.x -= 0.5; 
  uv.x *= 1.0+(dc.y*(0.3*warp)); 
  uv.x += 0.5;

  uv.y -= 0.5; 
  uv.y *= 1.0+(dc.x*(0.4*warp)); 
  uv.y += 0.5;

  // sample inside boundaries, otherwise set to black
  if (uv.y > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0) {
      fragColor = vec4(0.0,0.0,0.0,1.0);
  } else {
    // determine if we are drawing in a scanline
    float apply = abs(sin(fragCoord.y)*0.5*scan);
    // sample the texture
    fragColor = vec4(mix(texture2D(uMainSampler,uv).rgb,vec3(0.0),apply),1.0);
  }
}
// -- end original shader

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

class CrtTvFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game: Phaser.Game) {
        super({
            game,
            renderTarget: true,
            fragShader: fragmentShader,
        });
    }

    onPreRender() {
        this.set2f("uResolution", this.game.scale.width, this.game.scale.height);
    }
};

export default CrtTvFxPipeline;
