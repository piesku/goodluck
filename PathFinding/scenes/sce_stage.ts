import {Vec3} from "../../common/math.js";
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
    let face_count = mesh.IndexCount / 3;

    let faces_containing: Record<number, Array<number>> = {};
    let centroids: Record<number, Vec3> = {};
    let graph: Record<number, Array<[number, number]>> = {};

    // Prepare data for graph building.
    for (let face = 0; face < face_count; face++) {
        graph[face] = [];

        let v1 = mesh.IndexArray[face * 3 + 0];
        let v2 = mesh.IndexArray[face * 3 + 1];
        let v3 = mesh.IndexArray[face * 3 + 2];

        centroids[face] = [
            (mesh.VertexArray[v1 * 3 + 0] +
                mesh.VertexArray[v2 * 3 + 0] +
                mesh.VertexArray[v3 * 3 + 0]) /
                3,
            (mesh.VertexArray[v1 * 3 + 1] +
                mesh.VertexArray[v2 * 3 + 1] +
                mesh.VertexArray[v3 * 3 + 1]) /
                3,
            (mesh.VertexArray[v1 * 3 + 2] +
                mesh.VertexArray[v2 * 3 + 2] +
                mesh.VertexArray[v3 * 3 + 2]) /
                3,
        ];

        for (let i = 0; i < 3; i++) {
            let vert = mesh.IndexArray[face * 3 + i];
            if (faces_containing[vert]) {
                faces_containing[vert].push(face);
            } else {
                faces_containing[vert] = [face];
            }
        }
    }

    // Build the graph.
    for (let face = 0; face < face_count; face++) {
        let v1 = mesh.IndexArray[face * 3 + 0];
        let v2 = mesh.IndexArray[face * 3 + 1];
        let v3 = mesh.IndexArray[face * 3 + 2];

        for (let other of faces_containing[v1]) {
            if (
                other !== face &&
                (mesh.IndexArray[other * 3 + 0] === v2 ||
                    mesh.IndexArray[other * 3 + 1] === v2 ||
                    mesh.IndexArray[other * 3 + 2] === v2)
            ) {
                graph[face].push([other, manhattan(centroids[face], centroids[other])]);
                break;
            }
        }

        for (let other of faces_containing[v2]) {
            if (
                other !== face &&
                (mesh.IndexArray[other * 3 + 0] === v3 ||
                    mesh.IndexArray[other * 3 + 1] === v3 ||
                    mesh.IndexArray[other * 3 + 2] === v3)
            ) {
                graph[face].push([other, manhattan(centroids[face], centroids[other])]);
                break;
            }
        }

        for (let other of faces_containing[v3]) {
            if (
                other !== face &&
                (mesh.IndexArray[other * 3 + 0] === v1 ||
                    mesh.IndexArray[other * 3 + 1] === v1 ||
                    mesh.IndexArray[other * 3 + 2] === v1)
            ) {
                graph[face].push([other, manhattan(centroids[face], centroids[other])]);
                break;
            }
        }
    }

    console.log("--------------");
    console.log(faces_containing);
    console.log(centroids);
    console.log(graph);
}

function manhattan(a: Vec3, b: Vec3) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
}
