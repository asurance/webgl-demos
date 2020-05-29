attribute vec3 position;
attribute vec2 uv;

varying vec2 vUV;

uniform mat4 m;
uniform mat4 v;
uniform mat4 p;

void main(){
    vUV=uv;
    gl_Position=p*v*m*vec4(position,1.);
}