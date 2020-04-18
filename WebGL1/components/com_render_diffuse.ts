import {Material, Mesh} from "../../common/material.js";
import {Vec4} from "../../common/math.js";
import {GL_CW} from "../../common/webgl.js";
import {Entity, Game} from "../game.js";
import {Has} from "./com_index.js";
import {RenderKind} from "./com_render.js";

export interface RenderDiffuse {
    readonly Kind: RenderKind.Diffuse;
    readonly Material: Material;
    readonly Mesh: Mesh;
    readonly FrontFace: GLenum;
    Color: Vec4;
}

export function render_diffuse(material: Material, mesh: Mesh, color: Vec4) {
    return (game: Game, entity: Entity) => {
        game.World.Mask[entity] |= Has.Render;
        game.World.Render[entity] = {
            Kind: RenderKind.Diffuse,
            Material: material,
            Mesh: mesh,
            FrontFace: GL_CW,
            Color: color,
        };
    };
}

export const enum DiffuseAttribute {
    Position,
    Normal,
}

export const enum DiffuseUniform {
    PV,
    World,
    Self,
    Color,
    LightPositions,
    LightDetails,
}
