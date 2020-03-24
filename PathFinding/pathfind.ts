import {NavMesh} from "./navmesh";

type VectorField = Array<number | null>;

export function path_find(navmesh: NavMesh, origin: number, destination: number) {
    let predecessors: VectorField = [];
    predecessors[origin] = null;

    let boundary = [origin];
    while (boundary.length > 0) {
        let current = boundary.shift()!;
        if (current === destination) {
            return predecessors;
        }

        for (let i = 0; i < navmesh.Graph[current].length; i++) {
            let next = navmesh.Graph[current][i][0];
            if (predecessors[next] === undefined) {
                boundary.push(next);
                predecessors[next] = current;
            }
        }
    }

    return false;
}

export function* path_follow(path: VectorField, destination: number) {
    let current: number | null = destination;
    while (current !== null) {
        yield current;
        current = path[current];
    }
}
