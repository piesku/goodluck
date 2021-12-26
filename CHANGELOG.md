# Changelog

Goodluck doesn't have version numbers; each commit is the latest release of the template from which you can generate a new project.

However, we do distinguish between _generations_ of Goodluck. The core API changes between generations and there's a significant chance that systems written for one generation will not compatible with other generations. Adapting a system to a newer generation is usually easy, though.

## Generation 7 (since June 2021)

`Game` and `World` now inherit from `GameImpl` and `WorldImpl` respectively, defined in `common/`. Input handling and the game loop are now handled by the base classes, which allows the child classes to be lean and to contain mostly any extra data needed by the example. `Mixin`, `Blueprint`, and `instantiate` are now generic over the type of `Game` passed into them.

Once you bootstrap a new project, feel free to merge the super class with `Game` in `src/game.ts` to save a few bytes.

## Generation 6 (since March 2021)

- Blueprints are no longer objects of the `{Translation, Rotation, Scale, Using, Children}` shape. Instead, they are now regular arrays of mixings. The transform component must be added explicitly to the blueprint.

    ```js
    // BEFORE
    instantiate(game, {
        Translation: [1, 1, 0],
        Using: [light_directional([1, 1, 1], 0.5)],
    });

    // AFTER
    instantiate(game, [
        transform([1, 1, 0]), // Must be listed explicitly.
        light_directional([1, 1, 1], 0.5)
    ]);
    ```

- A new component, `Children`, now tracks the children relationships of the entity. The reverse relationship, i.e. the parent relationship, is still stored by the `Transform` and `Transform2D` component.

    ```js
    // BEFORE
    instantiate(game, {
        Translation: [0, 1, 5],
        Rotation: [0, 1, 0, 0],
        Children: [
            {
                Rotation: [0, 1, 0, 0],
                Using: [camera_canvas_perspective(1, 0.1, 1000)],
            },
        ],
    });

    // AFTER
    instantiate(game, [
        transform([0, 1, 5], [0, 1, 0, 0]),
        children([
            transform(undefined, [0, 1, 0, 0]),
            camera_canvas_perspective(1, 0.1, 1000)
        ]),
    ]);
    ```

- The parent relationship is now computed every frame by `sys_transform` and `sys_transform2d`, and it's undefined upon the creation on the entity.

## Generation 5 (since July 2020)

- `World.Mask` was renamed to `World.Signature` in [#39](https://github.com/piesku/goodluck/issues/39).

## Generation 4 (since February 2020)

- New directory layout. Each example is now an independent Goodluck project, with its own copy of `core.ts`, `game.ts`, etc. Some game-agnostic code has been moved to the top-level `common` directory.

## Generation 3 (since December 2019)

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

- Component checks are performed with bitwise operations between the `World.Mask` array and the `Has` enum.

    ```js
    if (game.World.Mask[entity] & Has.Transform) ...
    ```

- Component data is retrieved from `game.World`.

    ```js
    let transform = game.World.Transform[entity];
    ```

## Generation 2 (since October 2019)

- Names of all properties are PascalCase for better naming mangling and minification.

- Component masks are defined with a `const enum`, and are typically sorted alphabetically.

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

- `Game` is a regular class. Component data is stored under computed properties based on the `Get` enum.

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

## Generation 1 (since June 2019)

- Source code is written in TypeScript.

- Names of all properties are lowercase snake_case.

- Component masks are defined as constants.

    ```js
    export const TRANSFORM = 1 << 0;
    export const RENDER = 1 << 1;
    // ...
    ```

- `Game extends Array`. Component data is accessed with indices equal to component masks. The returned element must be asserted as the interface corresponding to requested component.

    ```js
    let transform = game[TRANSFORM][entity] as Transform;
    ```

- Entity checks are performed with bitwise operations using the component masks.

    ```js
    if (game.world[entity] & TRANSFORM) ...
    ```

## Generation 0 (since October 2018)

- Early experiments with ECS.
