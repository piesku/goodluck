# 🤞 Goodluck

A hackable template for creating small and fast browser games.

## Use-Cases

Goodluck is great for:

- Learning game programming and game design.
- Prototyping gameplay ideas.
- Building size-constrained games.
- Experimenting with algorithms and APIs.
- Modeling problems through animated simulations.

## Getting Started

Goodluck is not a typical library. You don't install it via `npm install`. Instead, use it as a template: generate a new repository from it, remove features you don't need, and hack away.

1. [Create a new repository](https://github.com/piesku/goodluck/generate) using Goodluck as a template.
2. Clone the newly created repository.

    _Note for Windows users:_ Goodluck uses symlinks to ease the maintenance of the included examples. When cloning from cmd.exe, PowerShell or GitHub Desktop you may need to set `git clone --config core.symlinks=true https://...`. Cloning from WSL1 and WSL2 should just work; I recommend WSL for Goodluck projects.

### Trying Out the Examples

In order to play with the examples included in the repo, run the development server.

1. `npm install` the build tools.
2. `npm start` the development server.
3. Open http://localhost:1234 in the browser.

    _Note for VS Code users:_ You can also press F5 to open a new browser window from within VS Code.

### Creating a New Project

When you're ready to start a new project, bootstrap it using one of the examples. I recommend `NewProject3D` which comes with most of Goodluck's components and systems. Once bootstrapped, the repo is completely yours to hack and customize, and you can remove everything you don't need.

1. Choose one of the examples as your starting point.
2. `./bootstrap.sh EXAMPLE_NAME`
3. The example's code is now in `src/`.

You will also find [Goodluck on Glitch](https://glitch.com/~goodluck) where you can [remix it into your own project](https://glitch.com/edit/#!/remix/goodluck)!

## Design Principles

Goodluck is a template for creating small browser games which fit in a few kilobytes. Apart from the game loop and the rendering pipeline, Goodluck doesn't give you much more code. We like to think of Goodluck as a set of good practices, architecture decisions, and tools.

1.  Write code that you need just for this game. Don't design extensible abstractions. Your goal is to ship a game, not to build an engine.

2.  Write data-driven code. Goodluck uses the ECS architecture; separate the data (components) from the logic (systems).

3.  Prefer simple procedural code and closed type systems. Instead of designing class inheritance hierarchies, use union types and `switch` between the variants.

## Tech Overview

Goodluck implements the entity-component-system (ECS) architecture:

1. _Entities_ are indices into arrays storing component data. A special array `World.Signature` stores entities' _signatures_ which define which components are enabled for a given entity. Signatures are implemented as bitsets; consequently, the maximum number of components is 32. This should still be plenty for small and even medium-sized games.

2. _Components_ are simple objects storing data, and only data. No logic goes into components. Each component defines an interface describing its data. Component data is stored in arrays in `World` instances. 

3. _Systems_ store the game logic which runs for entities which have certain components enabled. Systems are executed in a deterministic order in `Game#Update`, once per animation frame, as managed by the browser.

Goodluck is written in TypeScript, but it only uses a small subset of its features. The goal is to take advantage of the typing system and excellent editor support, while reducing any overhead in the final build. Hence, most features are strictly compile-only: they compile to zero bytes of JavaScript.

- Interfaces describe the shapes of components. The data is then stored in plain object literals matching these shapes.

- `const enums` act as non-iterable `enums`. They are replaced by their number value during compilation.

- `type` aliases offer a way to create discriminated type unions. A closed typed system works well for Goodluck because the code is only written with the current project in mind, and you have the total control over all types used across the project.

## Optimized Builds

Production builds are bundled into a single `.html` file and optimized for size. You can find them in `play/`.

1. (Optional) Edit the `EXAMPLE` path in `play/Makefile` if you called your
   source directory something other than `src`.
2. `make -C play`
3. Open `play/index.html` in the browser.

During build, the minifier mangles all variable names as well as all property names starting with a capital letter. That's why you'll see plenty of UpperCaseCamelCase names in Goodluck. All property names starting with a lower-case letter are preserved.

If you wish to preserve a name starting with an upper-case letter, use computed accessors: `game.Foo` will be mangled but `game["Foo"]` will not. This is particularly important for names defined by web standards, e.g. `KeyA` in `KeyboardEvent.key`.
