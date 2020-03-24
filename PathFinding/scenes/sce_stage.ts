import {from_euler} from "../../common/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {light_directional} from "../components/com_light.js";
import {render_basic} from "../components/com_render_basic.js";
import {render_diffuse} from "../components/com_render_diffuse.js";
import {instantiate} from "../core.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.Camera = undefined;
    game.ViewportResized = true;
    game.GL.clearColor(1, 1, 1, 1);

    // Camera.
    instantiate(game, {
        ...blueprint_camera(game),
        Translation: [0, 100, 0],
        Rotation: from_euler([0, 0, 0, 0], 90, 180, 0),
    });

    // Light.
    instantiate(game, {
        Translation: [1, 1, 1],
        Using: [light_directional([1, 1, 1], 1)],
    });

    instantiate(game, {
        Using: [render_diffuse(game.MaterialDiffuseGouraud, game.MeshTerrain, [0.3, 0.9, 0.9, 1])],
    });

    instantiate(game, {
        Translation: [0, 0.3, 0],
        Using: [render_basic(game.MaterialBasicWireframe, game.MeshNavmesh, [1, 1, 0, 1])],
    });

    let mesh = game.MeshNavmesh;

    let vert2face: Record<number, Array<number>> = {};
    for (let fi = 0; fi < mesh.IndexCount; fi += 3) {
        for (let vi = 0; vi < 3; vi++) {
            let v = mesh.IndexArray[fi + vi];
            if (vert2face[v]) {
                vert2face[v].push(fi);
            } else {
                vert2face[v] = [fi];
            }
        }
    }

    let graph: Record<number, Array<number>> = {};
    for (let faceidx = 0; faceidx < mesh.IndexCount; faceidx += 3) {
        graph[faceidx / 3] = [];
        for (let vertidx = 0; vertidx < 3; vertidx++) {
            let vertex = mesh.IndexArray[faceidx + vertidx];
            for (let otherfaceidx of vert2face[vertex]) {
                if (otherfaceidx === faceidx) {
                    continue;
                }
                other: for (let othervertidx = 0; othervertidx < 3; othervertidx++) {
                    let othervert = mesh.IndexArray[otherfaceidx + othervertidx];
                    if (othervert === vertex) {
                        continue other;
                    }
                    if (
                        othervert === mesh.IndexArray[faceidx + 0] ||
                        othervert === mesh.IndexArray[faceidx + 1] ||
                        othervert === mesh.IndexArray[faceidx + 2]
                    ) {
                        graph[faceidx / 3].push(otherfaceidx / 3);
                        break other;
                    }
                }
            }
        }
    }

    console.log(vert2face);
    console.log(graph);
}
