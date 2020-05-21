/* Main function, uniforms & utils */
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

/* Coordinate and unit utils */
vec2 coord(in vec2 p){
    p=p/u_resolution.xy;
    // correct aspect ratio
    if(u_resolution.x>u_resolution.y){
        p.x*=u_resolution.x/u_resolution.y;
        p.x+=(u_resolution.y-u_resolution.x)/u_resolution.y/2.;
    }else{
        p.y*=u_resolution.y/u_resolution.x;
        p.y+=(u_resolution.x-u_resolution.y)/u_resolution.x/2.;
    }
    // centering
    p-=.5;
    p*=vec2(-1.,1.);
    return p;
}

void main(){
    vec2 st = coord(gl_FragCoord.xy);
    vec2 mx = coord(u_mouse);
    vec3 color=vec3(
        abs(cos(st.x+mx.x)),
        abs(sin(st.y+mx.y)),
        abs(sin(u_time))
    );
    
    gl_FragColor=vec4(color,1.);
}