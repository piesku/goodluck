import {NavMesh} from "./navmesh";

type VectorField = Array<number>;

export function path_find(navmesh: NavMesh, origin: number, destination: number) {
    let predecessors: VectorField = [];

    let g: Array<number> = [];
    g[origin] = 0;

    let boundary = [origin];
    while (boundary.length > 0) {
        let lowest = lowest_cost(boundary, g);
        let current = boundary.splice(lowest, 1)[0];
        if (current === destination) {
            return predecessors;
        }

        for (let i = 0; i < navmesh.Graph[current].length; i++) {
            let next = navmesh.Graph[current][i][0];
            let cost = navmesh.Graph[current][i][1];
            let g_next = g[current] + cost;
            if (g[next] === undefined) {
                g[next] = g_next;
                predecessors[next] = current;
                boundary.push(next);
            } else if (g_next < g[next]) {
                g[next] = g_next;
                predecessors[next] = current;
            }
        }
    }

    return false;
}

function lowest_cost(boundary: Array<number>, g: Array<number>) {
    let min = 0;
    for (let i = 0; i < boundary.length; i++) {
        if (g[min] < g[i]) {
            min = i;
        }
    }
    return min;
}

export function* path_follow(path: VectorField, destination: number) {
    while (destination !== undefined) {
        yield destination;
        destination = path[destination];
    }
}
