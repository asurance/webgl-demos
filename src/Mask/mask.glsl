#ifdef GL_ES
precision mediump float;
#endif

varying vec2 texcoord;

void main(){
    float alpha=distance(texcoord,vec2(.5,.5));
    if(alpha>.5){
        discard;
    }
    gl_FragColor=vec4(1.,1.,1.,1.);
}