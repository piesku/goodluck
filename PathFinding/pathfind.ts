import {EPSILON} from "../common/math.js";
import {manhattan} from "../common/vec3.js";
import {NavMesh} from "./navmesh.js";

type VectorField = Array<number>;

export function path_find(navmesh: NavMesh, origin: number, goal: number) {
    let predecessors: VectorField = [];

    let g: Array<number> = [];
    g[origin] = 0;
    let h: Array<number> = [];
    h[origin] = 0;
    let f: Array<number> = [];
    f[origin] = 0;

    let boundary = [origin];
    while (boundary.length > 0) {
        let lowest = lowest_cost(boundary, f);
        let current = boundary.splice(lowest, 1)[0];
        if (current === goal) {
            return path_follow(predecessors, goal);
        }

        for (let i = 0; i < navmesh.Graph[current].length; i++) {
            let next = navmesh.Graph[current][i][0];
            let cost = navmesh.Graph[current][i][1];
            let g_next = g[current] + cost;
            if (g[next] === undefined) {
                h[next] = manhattan(navmesh.Centroids[next], navmesh.Centroids[goal]);
                g[next] = g_next;
                f[next] = g_next + h[next];
                predecessors[next] = current;
                boundary.push(next);
            } else if (g_next + EPSILON < g[next]) {
                g[next] = g_next;
                f[next] = g_next + h[next];
                predecessors[next] = current;
            }
        }
    }

    return false;
}

function lowest_cost(boundary: Array<number>, cost: Array<number>) {
    let min = 0;
    for (let i = 0; i < boundary.length; i++) {
        if (cost[boundary[i]] + EPSILON < cost[boundary[min]]) {
            min = i;
        }
    }
    return min;
}

function* path_follow(path: VectorField, destination: number) {
    while (destination !== undefined) {
        yield destination;
        destination = path[destination];
    }
}
