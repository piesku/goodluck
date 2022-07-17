# Assets

The Blender files in this directory are first exported to GLTF,
and then converted to TypeScript source files in `meshes/`
using `make -C meshes`.

Even though GLTF files contain data buffers that are ready to be uploaded to the GPU,
the mesh files reconstruct the arrays of numbers from these buffers.
This is done for two reasons:

- Some logic requires the actual vertex data anyways, e.g.
path finding on a navigation mesh,
tangent and bitangent computation for normal mapping, etc.

- In testing, it turned out that DEFLATE can compress these source files better than the equivalent GLTF files.

## Hints for GLTF Export

- Export only one mesh at a time.
- +Y is up.
- Apply modifiers.
