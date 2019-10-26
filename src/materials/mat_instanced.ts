import {InstancedAttribute} from "../components/com_render_vox.js";
import {GL_TRIANGLES} from "../webgl.js";
import {link, Material} from "./mat_common.js";

let vertex = `#version 300 es\n
    // Matrices: PV, world, self
    uniform mat4 p,q,r;
    // Color palette
    uniform vec3 s[16];

    // Light count
    uniform int t;
    // Light positions
    uniform vec3 u[100];
    // Light details
    uniform vec4 v[100];

    layout(location=${InstancedAttribute.Position}) in vec3 k;
    layout(location=${InstancedAttribute.Normal}) in vec3 m;
    layout(location=${InstancedAttribute.Offset}) in vec4 n;

    // Vertex color
    out vec4 o;

    void main(){
        // World position
        vec4 a=q*vec4(k+n.rgb,1.);
        // World normal
        vec3 b=normalize((vec4(m,0.)* r).rgb);
        gl_Position=p*a;

        // Color
        vec3 c=s[int(n[3])].rgb*.1;
        for(int i=0;i<t;i++){
            if(v[i].a<1.) {
                // A directional light.
                // max(dot()) is the diffuse factor.
                c+=s[int(n[3])].rgb*v[i].rgb*max(dot(b,normalize(u[i])),0.);
            }else{
                // A point light.
                // Light direction
                vec3 ld=u[i]-a.xyz;
                // Distance
                float d=length(ld);
                // max(dot()) is the diffuse factor.
                c+=s[int(n[3])].rgb*v[i].rgb*max(dot(b,normalize(ld)),0.)*v[i].a/(d*d);
            }
        }

        o=vec4(c,1.);
    }
`;

let fragment = `#version 300 es\n
    precision mediump float;

    // Vertex color
    in vec4 o;
    // Fragment color
    out vec4 z;

    void main(){
        z=o;
    }
`;

export function mat_instanced(GL: WebGL2RenderingContext) {
    let material: Material = {
        Mode: GL_TRIANGLES,
        Program: link(GL, vertex, fragment),
        Uniforms: [],
    };

    for (let name of ["p", "q", "r", "s", "t", "u", "v"]) {
        material.Uniforms.push(GL.getUniformLocation(material.Program, name)!);
    }

    return material;
}
