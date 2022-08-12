export type Entity = number;

/**
 * The base World class
 *
 * Stores all the component data for all entities, as well as the component
 * masks.
 *
 * Creating and destroying entities is O(1).
 */
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

/**
 * Find the first entity in the world with the given component mask.
 *
 * @param world The world to query.
 * @param query The component mask to query for.
 * @param start_at Start searching at this entity.
 */
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
