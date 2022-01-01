import {instantiate} from "../../common/game.js";
import {from_euler} from "../../common/quat.js";
import {blueprint_camera} from "../blueprints/blu_camera.js";
import {blueprint_camera_minimap} from "../blueprints/blu_camera_minimap.js";
import {blueprint_sun} from "../blueprints/blu_sun.js";
import {children} from "../components/com_children.js";
import {control_always} from "../components/com_control_always.js";
import {light_point} from "../components/com_light.js";
import {move} from "../components/com_move.js";
import {
    render_colored_shaded,
    render_colored_shadows,
    render_colored_unlit,
    render_mapped_shaded,
    render_textured_shaded,
    render_textured_unlit,
} from "../components/com_render.js";
import {transform} from "../components/com_transform.js";
import {Game} from "../game.js";
import {World} from "../world.js";

export function scene_stage(game: Game) {
    game.World = new World();
    game.ViewportResized = true;

    // Camera.
    instantiate(game, [...blueprint_camera(game), transform([0, 0, 7], [0, 1, 0, 0])]);

    // Minimap Camera.
    instantiate(game, [...blueprint_camera_minimap(game), transform([0, 0, 7], [0, 1, 0, 0])]);

    // Sun.
    instantiate(game, [
        transform(undefined, from_euler([0, 0, 0, 0], -45, 45, 0)),
        ...blueprint_sun(game),
    ]);

    // Ground.
    instantiate(game, [
        transform([0, -3, 0], undefined, [10, 1, 10]),
        render_colored_shadows(game.MaterialColoredShadows, game.MeshCube, [1, 1, 0, 1]),
    ]);

    let light_spread = 7;
    let light_range = 4;
    instantiate(game, [
        transform([0, 0, 5]),
        control_always(null, [0, 0, 1, 0]),
        move(0, 0.5),
        children(
            [transform([1 * light_spread, 0, 0]), light_point([1, 1, 1], light_range)],
            [
                transform([-0.5 * light_spread, 0.866 * light_spread, 0]),
                light_point([1, 1, 1], light_range),
            ],
            [
                transform([-0.5 * light_spread, -0.866 * light_spread, 0]),
                light_point([1, 1, 1], light_range),
            ]
        ),
    ]);

    let shadings = [
        // Unlit shading x3, flat gouraud shading.
        render_colored_unlit(game.MaterialColoredPoints, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_colored_unlit(game.MaterialColoredWireframe, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_colored_unlit(game.MaterialColoredUnlit, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_colored_shaded(game.MaterialColoredFlat, game.MeshIcosphereFlat, [1, 1, 0, 1], 256),

        // Colored Gouraud shading
        render_colored_shaded(game.MaterialColoredGouraud, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_colored_shaded(
            game.MaterialColoredGouraud,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            16,
            0,
            [1, 1, 0]
        ),
        render_colored_shaded(
            game.MaterialColoredGouraud,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            128,
            0,
            [1, 1, 0]
        ),
        render_colored_shaded(
            game.MaterialColoredGouraud,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            512,
            0,
            [1, 1, 0]
        ),

        // Colored Phong shading
        render_colored_shaded(game.MaterialColoredPhong, game.MeshIcosphereSmooth, [1, 1, 0, 1]),
        render_colored_shaded(
            game.MaterialColoredPhong,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            16,
            0,
            [1, 1, 0]
        ),
        render_colored_shaded(
            game.MaterialColoredPhong,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            128,
            0,
            [1, 1, 0]
        ),
        render_colored_shaded(
            game.MaterialColoredPhong,
            game.MeshIcosphereSmooth,
            [1, 1, 0, 1],
            512,
            0,
            [1, 1, 0]
        ),

        // Textured unlit shading
        render_textured_unlit(
            game.MaterialTexturedUnlit,
            game.MeshCube,
            game.Textures["Bricks059_1K_Color.jpg"]
        ),
        render_textured_unlit(
            game.MaterialTexturedUnlit,
            game.MeshCube,
            game.Textures["Wood063_1K_Color.jpg"]
        ),
        render_textured_unlit(
            game.MaterialTexturedUnlit,
            game.MeshCube,
            game.Textures["Concrete018_1K_Color.jpg"]
        ),
        render_textured_unlit(
            game.MaterialTexturedUnlit,
            game.MeshCube,
            game.Targets.Minimap.ColorTexture
        ),

        // Textured Gouraud shading (diffuse only)
        render_textured_shaded(
            game.MaterialTexturedGouraud,
            game.MeshCube,
            game.Textures["Bricks059_1K_Color.jpg"]
        ),
        render_textured_shaded(
            game.MaterialTexturedGouraud,
            game.MeshCube,
            game.Textures["Wood063_1K_Color.jpg"]
        ),
        render_textured_shaded(
            game.MaterialTexturedGouraud,
            game.MeshCube,
            game.Textures["Concrete018_1K_Color.jpg"]
        ),
        render_textured_shaded(
            game.MaterialTexturedGouraud,
            game.MeshCube,
            game.Targets.Minimap.ColorTexture
        ),

        // Textured Phong shading (high specular)
        render_textured_shaded(
            game.MaterialTexturedPhong,
            game.MeshCube,
            game.Textures["Bricks059_1K_Color.jpg"],
            512
        ),
        render_textured_shaded(
            game.MaterialTexturedPhong,
            game.MeshCube,
            game.Textures["Wood063_1K_Color.jpg"],
            512
        ),
        render_textured_shaded(
            game.MaterialTexturedPhong,
            game.MeshCube,
            game.Textures["Concrete018_1K_Color.jpg"],
            512
        ),
        render_textured_shaded(
            game.MaterialTexturedPhong,
            game.MeshCube,
            game.Targets.Minimap.ColorTexture,
            512
        ),

        // Mapped (diffuse, normal, roughness) shading
        render_mapped_shaded(
            game.MaterialMapped,
            game.MeshCube,
            game.Textures["Bricks059_1K_Color.jpg"],
            game.Textures["Bricks059_1K_Normal.jpg"],
            game.Textures["Bricks059_1K_Roughness.jpg"]
        ),
        render_mapped_shaded(
            game.MaterialMapped,
            game.MeshCube,
            game.Textures["Wood063_1K_Color.jpg"],
            game.Textures["Wood063_1K_Normal.jpg"],
            game.Textures["Wood063_1K_Roughness.jpg"]
        ),
        render_mapped_shaded(
            game.MaterialMapped,
            game.MeshCube,
            game.Textures["Concrete018_1K_Color.jpg"],
            game.Textures["Concrete018_1K_Normal.jpg"],
            game.Textures["Concrete018_1K_Roughness.jpg"]
        ),
        render_mapped_shaded(
            game.MaterialMapped,
            game.MeshCube,
            game.Targets.Minimap.ColorTexture,
            game.Textures["Concrete018_1K_Normal.jpg"],
            game.Textures["Concrete018_1K_Roughness.jpg"]
        ),
    ];

    let rows = 4;
    let cols = 7;
    let pad = 0.25;

    let offset_x = (cols + pad * (cols - 1)) / 2;
    let offset_y = (rows + pad * (rows - 1)) / 2;

    for (let col = 0; col < cols; col++) {
        for (let row = rows - 1; row >= 0; row--) {
            let y = row * (1 + pad) + 0.5;
            let render = shadings.shift();
            if (render) {
                let x = col * (1 + pad) + 0.5;
                instantiate(game, [
                    transform([x - offset_x, y - offset_y, 0]),
                    control_always(null, [0, 1, 0, 0]),
                    move(0, 0.1),
                    render,
                ]);
            }
        }
    }
}
