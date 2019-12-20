# Changelog

## goodluck3

- Entity masks and component data are stored in `World` instances.

    ```js
    class World {
        public Mask: Array<number> = [];
        public Animate: Array<Animate> = [];
        public AudioSource: Array<AudioSource> = [];
        // ...
        public Render: Array<Render> = [];
        public Transform: Array<Transform> = [];
    }

    class Game {
        public World = new World();
    }
    ```

- The `Get` enum has been removed.

- Component checks are performed with bitwise operations between the
`World.Mask` array and the `Has` enum.

    ```js
    if (game.World.Mask[entity] & Has.Transform) ...
    ```

- Component data is retrieved from `game.World`.

    ```js
    let transform = game.World.Transform[entity];
    ```

## goodluck2

- Names of all properties are PascalCase for better naming mangling and
minification.

- Component masks are defined with a `const enum`, and are typically sorted
alphabetically.

    ```js
    export const enum Get {
        Animate,
        AudioSource,
        // ...
        Render,
        Transform
    }

    export const enum Has {
        Animate = 1 << Get.Animate,
        AudioSource = 1 << Get.AudioSource,
        // ...
        Render = 1 << Get.Render,
        Transform = 1 << Get.Transform,
    }
    ```

- `Game` is a regular class. Component data is stored under computed
properties based on the `Get` enum.

    ```js
    class Game {
        public World: Array<number> = [];
        public [Get.Animate]: Array<Animate> = [];
        public [Get.AudioSource]: Array<AudioSource> = [];
        // ...
        public [Get.Render]: Array<Render> = [];
        public [Get.Transform]: Array<Transform> = [];
    }
    ```

- Entity checks are performed with bitwise operations using the `Has` enum.

    ```js
    if (game.World[entity] & Has.Transform) ...
    ```

## goodluck1

- Names of all properties are lowercase snake_case.

- Component masks are defined as constants.

    ```js
    export const TRANSFORM = 1 << 0;
    export const RENDER = 1 << 1;
    // ...
    ```

- `Game extends Array`. Component data is accessed with indices equal to
component masks. The returned element must be asserted as the interface corresponding to requested component.

    ```js
    let transform = game[TRANSFORM][entity] as Transform;
    ```

- Entity checks are performed with bitwise operations using the component masks.

    ```js
    if (game.world[entity] & TRANSFORM) ...
    ```
