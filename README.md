# 🤞 goodluck

A template for creating small and fast browser games.

## Getting Started

_goodluck_ is not a typical library. It's not suitable for installing via
`npm install`. Instead, use it as a template: clone it into a new repo,
remove features you don't need, and hack away.

1. [Create a new repository](https://github.com/piesku/goodluck/generate)
   using _goodluck_ as a template.
2. Clone the newly created repository.
3. `npm install` the build tools.
4. `npm start` the development server.

## Design Principles

_goodluck_ is a template for creating small browser games. Apart from the
game loop and the rendering pipeline, _goodluck_ doesn't give you much more
code. We like to think of _goodluck_ as a set of good practices, architecture
decisions, and tools.

1. Keep the scope small. Always start with the MVP version of each feature.

2. Write code just for this game. Your goal is to ship a game, not build an
   engine.

3. Write data-driven procedural code. Keep a strict separation between data
   (components) and logic (systems). Forgo object-oriented concepts like
   inheritance and polymorphism.

4. Prefer simple code. Write code that can be easily understood and reasoned
   about. Always measure the performance impact of new code.

## Tech Overview

_goodluck_ implements the entity-component-system (ECS) architecture:

1.  _Entities_ are indices into arrays storing component data. A special
    array called `Mask` stores masks defining which components are enabled
    for which entities. Component masks are implemented using bitflags, which
    limits the total number of available components to 32. This should still
    be plenty for small and even medium-sized games.

2.  _Components_ are simple objects storing data, and only data. No logic
    goes into components. Each component defines an interface describing its
    data. Component data is stored in arrays in `World` instances.

3.  _Systems_ store the game logic which runs for entities which have certain
    components enabled. Systems are executed in a deterministic order in
    `Game#Update`, once per animation frame, as managed by the browser.

_goodluck_ is written in TypeScript, but it only uses a small subset of its
features. The goal is to take advantage of the typing system and excellent
editor support, while reducing any overhead in the final build. Hence, most
features are strictly compile-only: they compile to zero bytes of JavaScript.

-   Interfaces describe the shapes of components. The data is then stored in
    plain object literals matching these shapes.

-   `const enums` act as non-iterable `enums`. They are replaced by their
    number value during compilation.

-   `type` aliases offer a way to create discriminated type unions. A closed
    typed system works well for _goodluck_ because the code is only written with
    the current project in mind, and you have the total control over all types
    used across the project.

## Creating a New Project

When you're ready to start a new project, rename `NewProject2D` or
`NewProject3D` to a name of your choosing (or simply `src`). Alternatively,
you may want to start basing on one of the included example projects. Feel
free to copy components and systems from other examples as needed, but keep in
mind that you might need to adjust the code slightly to make it work for your
use-case.

When copying components, remember to add corresponding `Has` enum variants in
`components/com_index.ts`. If the added components store data, make room for
it in `World` in `world.ts`.

Once you've copied everything you need, feel free to remove all other project
directories in the repository! It's completely yours to hack and customize.

## Optimized Builds

Production builds are bundled into a single `.js` file and optimized for
size. You can find them in `play/`.

1. Edit the `INDEX` path in `play/Makefile` to match the entry point of your project.
2. `make -C play`
3. Open `play/index.html` in the browser.
