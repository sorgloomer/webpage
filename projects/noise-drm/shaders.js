import { shader } from './shader-helper.js';

// language=glsl
export const vshader = shader`
precision highp float;

attribute vec2 aPosition;
varying vec2 vPosition;

void main() {
  vPosition = aPosition;
  gl_Position = vec4(
    aPosition.x * 2.0 - 1.0,
    aPosition.y * 2.0 - 1.0,
    0.0, 
    1.0
  );
}
`;

