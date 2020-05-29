precision mediump float;

varying vec2 vUV;

uniform sampler2D tex;

void main(){
    gl_FragColor=texture2D(tex,vUV);
}