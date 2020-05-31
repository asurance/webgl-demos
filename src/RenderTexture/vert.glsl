attribute vec2 position;
attribute vec2 uv;
varying vec2 texcoord;
void main(){
    texcoord=uv;
    gl_Position=vec4(position,0.,1.);
}