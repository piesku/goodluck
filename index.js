import Game from "./game.js";

import BasicMaterial from "./materials/mat_basic.js";
import WireframeMaterial from "./materials/mat_wireframe.js";
import PointsMaterial from "./materials/mat_points.js";
import FlatMaterial from "./materials/mat_flat.js";
import GouraudMaterial from "./materials/mat_gouraud.js";
import PhongMaterial from "./materials/mat_phong.js";
import ToonMaterial from "./materials/mat_toon.js";

import {camera, lighting, rotating} from "./creators.js";
import * as Icosphere from "./shapes/icosphere.js";

window.game = new Game();
game.camera = camera(game, {
    translation: [0, 0, 10],
    fovy: 1,
    aspect: game.canvas.width / game.canvas.height,
    near: 0.1,
    far: 1000,
});
lighting(game, {translation: [-10, 5, 10], range: 12});

let basic_material = new BasicMaterial(game.gl);
let wireframe_material = new WireframeMaterial(game.gl);
let points_material = new PointsMaterial(game.gl);
let flat_material = new FlatMaterial(game.gl);
let gouraud_material = new GouraudMaterial(game.gl);
let phong_material = new PhongMaterial(game.gl);
let toon_material = new ToonMaterial(game.gl);

rotating(game, Icosphere, phong_material, {
    translation: [0, 0, 0], scale: [2, 2, 2], color: [1, 1, 0.3, 1]
});

game.start();
