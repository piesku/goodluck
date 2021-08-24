export type Entity = number;

export class WorldImpl {
    Signature: Array<number> = [];
    Graveyard: Array<Entity> = [];

    CreateEntity() {
        if (this.Graveyard.length > 0) {
            return this.Graveyard.pop()!;
        }

        if (DEBUG && this.Signature.length > 10000) {
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

export function first_entity(world: WorldImpl, query: number, start_at = 0): Entity | undefined {
    for (let i = start_at; i < world.Signature.length; i++) {
        if ((world.Signature[i] & query) === query) {
            return i;
        }
    }
}
