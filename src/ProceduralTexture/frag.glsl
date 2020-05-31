#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(vec2 uv,vec2 center){
    return smoothstep(.4,.5,length(uv-center));
}

void main(){
    vec2 uv=gl_FragCoord.xy/vec2(50.,50.);
    vec2 coord=mod(floor(uv),2.)*2.-1.;
    vec2 center=vec2(.5,.5);
    vec2 center2;
    uv=fract(uv);
    vec2 timeMod=mod(floor(vec2(u_time)+vec2(0.,1.)),2.);
    vec2 scale=coord*timeMod;
    center.y+=scale.x*fract(u_time);
    center2.y=center.y-scale.x;
    center.x+=scale.y*fract(u_time);
    center2.x=center.x-scale.y;
    float value=circle(uv,center);
    value*=circle(uv,center2);
    gl_FragColor=vec4(vec3(value),1.);
}