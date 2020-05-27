#ifdef GL_ES
precision mediump float;
#endif

varying vec3 vNormal;
varying vec2 vUV;

uniform sampler2D tex;

void main(){
    gl_FragColor=texture2D(tex,vUV);
}