# Goodluck — Context Document

This document provides a comprehensive overview of the Goodluck game engine, including its technology stack, architecture, key principles, and guidelines for contributors.

## 1. Tech Stack

The project is built primarily with **TypeScript**, leveraging its typing system for better code quality and editor support while minimizing runtime overhead. Key technologies and libraries include:

* **TypeScript**: The primary language, using features like interfaces and const enums that compile down to efficient JavaScript.  
* **WebGL2**: For rendering graphics, accessed directly without a high-level library.  
* **Build Tools**:  
  * esbuild: For bundling the TypeScript source code.  
  * Terser: For minifying the bundled JavaScript.  
  * Roadroller: For further optimizing the JavaScript code size.  
  * PostHTML and htmlnano: For processing and minifying the final HTML output.  
* **No external runtime libraries**: The engine is self-contained and does not rely on external game frameworks.

## 2. Framework Architecture (ECS)

Goodluck is a repository template, not a typical library. The user generates a new repository from the template, removes unnecessary code, and modifies it as needed. This is particularly useful for optimizing code for size and when quick, specific changes are required.  
Goodluck implements the **Entity-Component-System (ECS)** architecture, which favors composition over inheritance.

* **Components**: Game object data is stored in arrays of components, each responsible for a different concern (e.g., Transform, Render, Collide). Components can be dynamically added and removed during an entity's lifetime. Component data is stored in large arrays indexed by entities, which improves data locality (Structure of Arrays vs. Array of Structures). Components are defined as TypeScript interfaces to emphasize that they should only contain data, not logic (methods).  
* **Entities**: These are simply indices (type number) into the component arrays. They also index a special Signature array, which for each entity stores a bitmask of currently enabled components. The maximum number of components in Goodluck is 32 due to 32-bit bitwise operations in JavaScript.  
* **Systems**: These are functions called one by one, which iterate over all entities in the scene and execute logic on those entities whose signatures match the system's query mask. Game data flows in one direction, stored in component arrays and processed by systems in a deterministic order.

## 3. Key Principles of Goodluck

* **Minimal Abstractions**: Goodluck intentionally avoids excessive abstractions, generalizations, and parameterization to keep the code simple, predictable, and fast in execution. The goal is to ship a game rather than build a generic engine.  
* **Bitwise Operations**: Goodluck uses bitflags and bitmasks to store the component composition of entities. Bitwise operations are fast and simple to work with, even though the JS engine casts to 32-bit integers for these operations.  
* **for Loops**: For iterating over entities in systems, Goodluck uses standard for loops, which are generally very efficient, even with tens of thousands of signatures.  
* **Data Locality**: Component data is stored in large arrays (one array per component), which improves data locality and performance, similar to column-oriented databases (Structure of Arrays).  
* **Math Functions with out Parameter**: The math library (based on glMatrix) uses a pattern where vector functions take a reference to an output vector (out) as the first parameter. This helps avoid short-lived memory allocations and associated GC pauses.  
* **Component Mixins**: Components are added using mixin functions, which return thunks called during new entity creation. This allows modification of Game and World instances when adding a component.  
* **Free Functions**: Much of Goodluck's logic is implemented as free (non-member) functions that take the object to process as the first parameter. This allows for more effective tree-shaking by build tools.  
* **Repository Template**: Goodluck is designed for extreme "hackability." After generating a project from the template, the user gets all the code for any modification, without needing to worry about updates to newer versions of Goodluck.

## 4. Directory Structure

The repository is organized into several main directories:

* .github/workflows/: Contains CI/CD configuration files.  
* assets/: Raw asset files like .gltf models.  
* core/: Core components, systems, and UI elements shared across examples.  
* lib/: Common libraries for math, rendering, and game logic.  
* materials/: Shader and material definitions.  
* meshes/: TypeScript files generated from the assets.  
* play/: Contains the build pipeline for creating optimized production builds.  
* reference/: Scripts for generating API documentation.  
* textures/: Image files for textures.  
* util/: Utility scripts for asset conversion.  
* **Example Directories** (e.g., Animate/, FirstPerson/): Each example is a self-contained project demonstrating different features of the engine.

## 5. Main Game Loop

The main game loop is managed by the GameImpl class in lib/game.ts. The FrameUpdate method in each example's game.ts file defines the order in which systems are executed each frame. A typical frame looks like this:

1. **Input Handling**: Process player input from keyboard, mouse, touch, and gamepads.  
2. **Physics and Collisions**:  
   * sys\_physics\_integrate: Apply acceleration and velocity.  
   * sys\_transform: Update entity transforms.  
   * sys\_collide: Detect collisions.  
   * sys\_physics\_resolve: Resolve collisions.  
   * sys\_transform: Update transforms again to reflect collision responses.  
3. **Game Logic**: Run systems for AI, movement, animations, and other game mechanics.  
4. **Rendering**:  
   * sys\_light: Collect lighting information.  
   * sys\_render\_depth: Render shadow maps.  
   * sys\_render\_forward / sys\_render\_deferred: Render the scene.  
   * sys\_draw: Render 2D primitives.  
   * sys\_ui: Render the UI.

## 6. Rendering Pipeline

Goodluck supports both forward and deferred rendering pipelines.

* **Forward Rendering**: The default pipeline, suitable for most games. It renders objects directly to the screen or a texture. Transparent objects are sorted back-to-front and rendered after opaque objects.  
* **Deferred Rendering**: A more advanced pipeline that separates geometry and lighting calculations. It first renders scene information (position, normals, color) to a G-buffer and then applies lighting in a separate pass. This is more efficient for scenes with many dynamic lights.  
* **Post-processing**: The deferred shading example includes a post-processing step for effects like bloom, tone-mapping, and FXAA.

## 7. Input Handling

Input is handled in the GameImpl class. It listens for mouse, keyboard, touch, and gamepad events and updates the InputState and InputDelta records. Systems like sys\_control\_keyboard and sys\_control\_mouse\_move then use this information to update the state of controllable entities.

## 8. Summary for New Collaborators and AI Agents

This project is built on the Goodluck framework, which uses an Entity-Component-System architecture. Key concepts include:

* **ECS**: Entities are identifiers, components store data, and systems implement logic. Familiarize yourself with the files in src/components/ and src/systems/.  
* **Good Practices**: Adhere to Goodluck's emphasis on minimal abstractions, direct data manipulation in component arrays, and the use of simple for loops within systems to maintain performance and code simplicity.  
* **Data Flow**: Systems are called in a specific order in src/game.ts, processing data from components.  
* **Rendering**: Primarily through WebGL, with systems like sys\_render\_forward and sys\_render2d.  
* **TypeScript**: All code is written in TypeScript, ensuring type safety.  
* **Project Structure**: Review the directory structure outlined above to understand where different parts of the code are located.
