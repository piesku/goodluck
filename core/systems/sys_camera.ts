import {copy, get_translation, invert, multiply, ortho, perspective} from "../../common/mat4.js";
import {ProjectionKind, ProjectionOrtho, ProjectionPerspective} from "../../common/projection.js";
import {CameraKind} from "../components/com_camera.js";
import {Game} from "../game.js";
import {Has} from "../world.js";

const QUERY = Has.Transform | Has.Camera;

export function sys_camera(game: Game, delta: number) {
    if (game.ViewportWidth != window.innerWidth || game.ViewportHeight != window.innerHeight) {
        game.ViewportWidth = game.Canvas.width = game.Billboard.width = window.innerWidth;
        game.ViewportHeight = game.Canvas.height = game.Billboard.height = window.innerHeight;
        game.ViewportResized = true;
    }

    game.Cameras = [];
    for (let i = 0; i < game.World.Signature.length; i++) {
        if ((game.World.Signature[i] & QUERY) === QUERY) {
            let camera = game.World.Camera[i];
            let transform = game.World.Transform[i];
            let projection = camera.Projection;

            if (game.ViewportResized) {
                switch (projection.Kind) {
                    case ProjectionKind.Perspective: {
                        let aspect =
                            camera.Kind === CameraKind.Display
                                ? game.ViewportWidth / game.ViewportHeight
                                : camera.Target.Width / camera.Target.Height;
                        resize_perspective(projection, aspect);
                        break;
                    }
                    case ProjectionKind.Ortho:
                        resize_ortho(projection);
                        break;
                }
            }

            copy(camera.View, transform.Self);
            multiply(camera.Pv, projection.Projection, camera.View);
            get_translation(camera.Position, transform.World);

            game.Cameras.push(camera);
        }
    }
}

function resize_perspective(projection: ProjectionPerspective, aspect: number) {
    if (aspect > 1) {
        // Landscape orientation.
        perspective(
            projection.Projection,
            projection.FovY,
            aspect,
            projection.Near,
            projection.Far
        );
        invert(projection.Unprojection, projection.Projection);
    } else {
        // Portrait orientation.
        perspective(
            projection.Projection,
            projection.FovY / aspect,
            aspect,
            projection.Near,
            projection.Far
        );
        invert(projection.Unprojection, projection.Projection);
    }
}

function resize_ortho(projection: ProjectionOrtho) {
    ortho(
        projection.Projection,
        projection.Radius,
        projection.Radius,
        -projection.Radius,
        -projection.Radius,
        projection.Near,
        projection.Far
    );
    invert(projection.Unprojection, projection.Projection);
}
