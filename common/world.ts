export type Entity = number;

export class WorldImpl {
    Capacity: number;
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    constructor(capacity: number = 10_000) {
        this.Capacity = capacity;
    }

    CreateEntity() {
        if (this.Graveyard.length > 0) {
            return this.Graveyard.pop()!;
        }

        if (DEBUG && this.Signature.length > this.Capacity) {
            throw new Error("No more entities available.");
        }

        // Push a new signature and return its index.
        return this.Signature.push(0) - 1;
    }

    DestroyEntity(entity: Entity) {
        this.Signature[entity] = 0;

        if (DEBUG && this.Graveyard.includes(entity)) {
            throw new Error("Entity already in graveyard.");
        }

        this.Graveyard.push(entity);
    }
}

// Other methods are free functions for the sake of tree-shakability.

export function first_having(
    world: WorldImpl,
    query: number,
    start_at: Entity = 0
): Entity | undefined {
    for (let i = start_at; i < world.Signature.length; i++) {
        if ((world.Signature[i] & query) === query) {
            return i;
        }
    }
}
